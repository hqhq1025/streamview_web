"""Verify that GET /api/state surfaces the fields the evaluator requires.

The store-level normalizer materialises defaults for ``videos[i].{description,
tags,status,visibility}`` so seeded records and caller-provided records both
expose a stable shape, and any capitalized legacy ``visibility`` values are
folded back to lowercase.
"""

import io

import pytest


@pytest.mark.asyncio
async def test_control_plane_is_hidden_from_public_openapi(async_client):
    schema = (await async_client.get("/api/openapi.json")).json()
    assert "/api/state" not in schema["paths"]
    assert all(tag.get("name") != "state" for tag in schema.get("tags", []))


@pytest.mark.asyncio
async def test_seeded_videos_have_default_fields(async_client):
    resp = await async_client.get("/api/state", params={"cookie": "normalizer-seed"})
    assert resp.status_code == 200
    videos = resp.json()["state"]["data"]["videos"]
    assert len(videos) > 0
    for video in videos:
        assert "description" in video
        assert "tags" in video and isinstance(video["tags"], list)
        assert "status" in video
        assert video.get("visibility") == "public"


@pytest.mark.asyncio
async def test_patch_preserves_defaults_on_new_videos(async_client):
    cookie = "normalizer-patch"
    minimal = {"id": "vid_minimal", "title": "Bare"}
    await async_client.patch(
        "/api/state",
        params={"cookie": cookie},
        json={"data": {"videos": [minimal]}},
    )
    resp = await async_client.get("/api/state", params={"cookie": cookie})
    assert resp.status_code == 200
    videos = resp.json()["state"]["data"]["videos"]
    found = next((v for v in videos if v.get("id") == "vid_minimal"), None)
    assert found is not None
    assert found["description"] == ""
    assert found["tags"] == []
    assert found["status"] == "draft"
    assert found["visibility"] == "public"


@pytest.mark.asyncio
async def test_put_preserves_caller_provided_fields(async_client):
    cookie = "normalizer-put"
    payload = {
        "data": {
            "videos": [
                {
                    "id": "vid_custom",
                    "title": "Custom",
                    "description": "hello",
                    "tags": ["a"],
                    "status": "public",
                    "visibility": "unlisted",
                }
            ]
        }
    }
    resp = await async_client.put("/api/state", params={"cookie": cookie}, json=payload)
    assert resp.status_code == 200
    video = resp.json()["state"]["data"]["videos"][0]
    assert video["description"] == "hello"
    assert video["tags"] == ["a"]
    assert video["status"] == "public"
    assert video["visibility"] == "unlisted"


@pytest.mark.asyncio
async def test_normalizer_lowercases_legacy_visibility(async_client):
    """Legacy captured state may use capitalized 'Public'/'Private' — fold to lowercase."""
    cookie = "normalizer-legacy"
    payload = {
        "data": {
            "videos": [
                {"id": "vid_legacy_public", "title": "A", "visibility": "Public"},
                {"id": "vid_legacy_private", "title": "B", "visibility": "PRIVATE"},
                {"id": "vid_legacy_bogus", "title": "C", "visibility": "draft"},
            ]
        }
    }
    resp = await async_client.put("/api/state", params={"cookie": cookie}, json=payload)
    assert resp.status_code == 200
    videos = resp.json()["state"]["data"]["videos"]
    by_id = {v["id"]: v for v in videos}
    assert by_id["vid_legacy_public"]["visibility"] == "public"
    assert by_id["vid_legacy_private"]["visibility"] == "private"
    # Unknown values coerce back to the safe default, not silently accepted.
    assert by_id["vid_legacy_bogus"]["visibility"] == "public"


@pytest.mark.asyncio
async def test_upload_endpoint_defaults_visibility_to_public(async_client):
    cookie = "upload-default"
    resp = await async_client.post(
        "/api/streamview/videos",
        params={"cookie": cookie},
        files={"file": ("clip.mp4", io.BytesIO(b"fake-bytes"), "video/mp4")},
        data={"title": "Default visibility clip", "description": "", "tags": ""},
    )
    assert resp.status_code == 200
    videos = resp.json()["data"]["videos"]
    uploaded = next(v for v in videos if v["title"] == "Default visibility clip")
    assert uploaded["visibility"] == "public"
    assert uploaded["status"] == "draft"


@pytest.mark.asyncio
async def test_upload_endpoint_persists_private_visibility(async_client):
    cookie = "upload-private"
    resp = await async_client.post(
        "/api/streamview/videos",
        params={"cookie": cookie},
        files={"file": ("clip.mp4", io.BytesIO(b"fake-bytes"), "video/mp4")},
        data={
            "title": "Draft clip",
            "description": "",
            "tags": "",
            "visibility": "private",
        },
    )
    assert resp.status_code == 200
    videos = resp.json()["data"]["videos"]
    uploaded = next(v for v in videos if v["title"] == "Draft clip")
    assert uploaded["visibility"] == "private"


@pytest.mark.asyncio
async def test_upload_endpoint_rejects_unknown_visibility(async_client):
    cookie = "upload-bogus"
    resp = await async_client.post(
        "/api/streamview/videos",
        params={"cookie": cookie},
        files={"file": ("clip.mp4", io.BytesIO(b"fake-bytes"), "video/mp4")},
        data={
            "title": "Bogus clip",
            "description": "",
            "tags": "",
            "visibility": "draft",
        },
    )
    assert resp.status_code == 400
    body = resp.json()
    assert body["detail"]["error"] == "invalid_visibility"
