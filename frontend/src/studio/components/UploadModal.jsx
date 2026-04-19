import React, { useState } from 'react';

export default function UploadModal({ onClose, onUpload, onNotImplemented }) {
  const [step, setStep] = useState(0); // 0: Select, 1: Details, 2: Elements, 3: Checks, 4: Visibility
  const [file, setFile] = useState(null);
  const [visibility, setVisibility] = useState("public");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const nextFile = e.target.files[0];
      setFile(nextFile);
      setTitle(nextFile.name);
      setDescription("");
      setTags("");
      setVisibility("public");
      setUploadProgress(null);
      setUploadError("");
      setIsUploading(false);
      setStep(1);
    }
  };

  const handlePublish = async () => {
    if (!file || isUploading) return;
    setIsUploading(true);
    setUploadProgress(null);
    setUploadError("");
    try {
      if (onUpload) {
        await onUpload({
          file,
          visibility: String(visibility || "public").toLowerCase(),
          title,
          description,
          tags,
          onProgress: (progress) => {
            if (typeof progress === "number" && Number.isFinite(progress)) {
              setUploadProgress(Math.min(100, Math.max(0, progress)));
            } else {
              setUploadProgress(null);
            }
          },
        });
      }
      if (onClose) {
        onClose();
      } else {
        setIsUploading(false);
      }
    } catch (err) {
      console.error(err);
      setUploadError(err?.message || "Upload failed.");
      setIsUploading(false);
    }
  };

  const steps = [
    { label: "Details", index: 1 },
    { label: "Video elements", index: 2 },
    { label: "Checks", index: 3 },
    { label: "Visibility", index: 4 },
  ];

  const handleNotImplemented = (feature) => {
    if (typeof onNotImplemented === "function") {
      onNotImplemented(feature);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
      <div className="bg-white w-[960px] h-[90vh] rounded-xl flex flex-col shadow-2xl animate-rise-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
          <h2 className="text-xl font-medium text-[#0d0d0d]">
            {step === 0 ? "Upload videos" : file?.name || "Video details"}
          </h2>
          <div className="flex items-center gap-4">
            <button
              className="p-2 hover:bg-[#f2f2f2] rounded-full"
              onClick={() => handleNotImplemented("Upload help")}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#606060]">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
              </svg>
            </button>
            <button onClick={onClose} className="p-2 hover:bg-[#f2f2f2] rounded-full">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#606060]">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Stepper (only visible after step 0) */}
        {step > 0 && (
          <div className="px-6 py-4 border-b border-[#e5e5e5] bg-white">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((s, i) => (
                <div key={s.index} className="flex items-center">
                  <div className={`flex flex-col items-center gap-1 ${step >= s.index ? 'text-[#065fd4]' : 'text-[#606060]'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step >= s.index ? 'border-[#065fd4] bg-[#065fd4]/10' : 'border-[#606060]'}`}>
                      {step > s.index ? (
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                        </svg>
                      ) : (
                        s.label === "Checks" && step === s.index ? <span className="animate-spin">C</span> : // Placeholder for loading check
                        i + 1
                      )}
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wider">{s.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-[1px] w-24 mx-2 ${step > s.index ? 'bg-[#065fd4]' : 'bg-[#e5e5e5]'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {step === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-32 h-32 bg-[#f9f9f9] rounded-full flex items-center justify-center mb-6">
                <svg viewBox="0 0 24 24" className="w-16 h-16 fill-[#909090]">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path>
                </svg>
              </div>
              <h3 className="text-[#0d0d0d] text-lg font-medium mb-2">Drag and drop video files to upload</h3>
              <p className="text-[#606060] text-sm mb-8">Your videos will be private until you publish them.</p>
              <label className="bg-[#065fd4] text-white px-4 py-2 rounded-sm font-medium cursor-pointer hover:bg-[#0056b3]">
                SELECT FILES
                <input type="file" className="hidden" onChange={handleFileSelect} accept="video/*" />
              </label>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm text-[#606060]">Title (required)</label>
                    <span className="text-xs text-[#606060]">0/100</span>
                  </div>
                  <div className="border border-[#cccccc] rounded p-2 focus-within:border-[#065fd4]">
                    <input
                      type="text"
                      className="w-full bg-transparent text-[#0d0d0d] outline-none"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm text-[#606060]">Description</label>
                    <span className="text-xs text-[#606060]">0/5000</span>
                  </div>
                  <div className="border border-[#cccccc] rounded p-2 focus-within:border-[#065fd4] h-32">
                    <textarea
                      className="w-full h-full bg-transparent text-[#0d0d0d] outline-none resize-none"
                      placeholder="Tell viewers about your video"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                    ></textarea>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-[#606060]">Tags</label>
                  <p className="text-xs text-[#606060] mb-2">Separate tags with commas (e.g. pudding, cream_soup, egypt).</p>
                  <div className="border border-[#cccccc] rounded p-2 focus-within:border-[#065fd4]">
                    <input
                      type="text"
                      className="w-full bg-transparent text-[#0d0d0d] outline-none"
                      placeholder="tag1, tag2, tag3"
                      value={tags}
                      onChange={(event) => setTags(event.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#606060]">Thumbnail</label>
                  <p className="text-xs text-[#606060] mb-2">Select or upload a picture that shows what's in your video.</p>
                  <div className="flex gap-4">
                    <div className="w-32 h-20 border border-dashed border-[#cccccc] flex flex-col items-center justify-center text-[#606060] text-xs cursor-pointer hover:bg-[#f2f2f2]">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 mb-1 fill-current"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"></path></svg>
                      Upload file
                    </div>
                    <div className="w-32 h-20 bg-[#f9f9f9] flex items-center justify-center text-[#606060] text-xs">Auto-generated</div>
                    <div className="w-32 h-20 bg-[#f9f9f9] flex items-center justify-center text-[#606060] text-xs">Auto-generated</div>
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <div className="bg-[#f9f9f9] rounded p-4 sticky top-0">
                  <div className="aspect-video bg-black mb-2 flex items-center justify-center text-[#aaaaaa]">Video Preview</div>
                  <div className="space-y-2">
                    <div className="text-xs text-[#606060]">Video Link</div>
                    <div className="text-[#065fd4] text-sm truncate">https://youtu.be/xyz123</div>
                    <div className="text-xs text-[#606060]">Filename</div>
                    <div className="text-[#0d0d0d] text-sm truncate">{file?.name}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-[#0d0d0d]">Video elements</h3>
              <p className="text-sm text-[#606060]">Use cards and an end screen to show viewers related videos, websites, and calls to action.</p>
              
              <div className="bg-[#f9f9f9] p-4 rounded flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[#e5e5e5] rounded">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#606060]"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-[#0d0d0d] font-medium">Add subtitles</h4>
                    <p className="text-xs text-[#606060]">Reach a broader audience by adding subtitles to your video</p>
                  </div>
                </div>
                <button
                  className="text-[#065fd4] font-medium uppercase text-sm hover:bg-[#065fd4]/10 px-3 py-1.5 rounded"
                  onClick={() => handleNotImplemented("Subtitles")}
                >
                  Add
                </button>
              </div>

              <div className="bg-[#f9f9f9] p-4 rounded flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[#e5e5e5] rounded">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#606060]"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 15h14v3H5v-3zm0-8h14v6H5V7z"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-[#0d0d0d] font-medium">Add an end screen</h4>
                    <p className="text-xs text-[#606060]">Promote related content at the end of your video</p>
                  </div>
                </div>
                <button
                  className="text-[#065fd4] font-medium uppercase text-sm hover:bg-[#065fd4]/10 px-3 py-1.5 rounded"
                  onClick={() => handleNotImplemented("End screen")}
                >
                  Import from video
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-[#0d0d0d]">Checks</h3>
              <p className="text-sm text-[#606060]">We'll check your video for issues that may restrict its visibility and then you will have the opportunity to fix them before publishing.</p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#606060]"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-[#0d0d0d] font-medium">Copyright</h4>
                      <span className="text-green-600 text-sm flex items-center gap-1">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>
                        No issues found
                      </span>
                    </div>
                    <p className="text-xs text-[#606060]">No copyright issues were found.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2 space-y-6">
                <h3 className="text-lg font-medium text-[#0d0d0d]">Visibility</h3>
                <p className="text-sm text-[#606060]">Choose when to publish and who can see your video.</p>
                
                <div className="border border-[#cccccc] rounded p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="visibility"
                      className="mt-1"
                      checked={visibility === "private"}
                      onChange={() => setVisibility("private")}
                    />
                    <div>
                      <h4 className="text-[#0d0d0d] font-medium">Private</h4>
                      <p className="text-xs text-[#606060]">Only you and people you choose can watch your video</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="visibility"
                      className="mt-1"
                      checked={visibility === "unlisted"}
                      onChange={() => setVisibility("unlisted")}
                    />
                    <div>
                      <h4 className="text-[#0d0d0d] font-medium">Unlisted</h4>
                      <p className="text-xs text-[#606060]">Anyone with the video link can watch your video</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="visibility"
                      className="mt-1"
                      checked={visibility === "public"}
                      onChange={() => setVisibility("public")}
                    />
                    <div>
                      <h4 className="text-[#0d0d0d] font-medium">Public</h4>
                      <p className="text-xs text-[#606060]">Everyone can watch your video</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[#0d0d0d] font-medium">Schedule</h4>
                  <p className="text-xs text-[#606060]">Select a date to make your video public.</p>
                </div>
              </div>
              
              <div className="col-span-1">
                <div className="bg-[#f9f9f9] rounded p-4 sticky top-0">
                  <div className="aspect-video bg-black mb-2 flex items-center justify-center text-[#aaaaaa]">Video Preview</div>
                  <div className="space-y-2">
                    <div className="text-xs text-[#606060]">Video Link</div>
                    <div className="text-[#065fd4] text-sm truncate">https://youtu.be/xyz123</div>
                    <div className="text-xs text-[#606060]">Filename</div>
                    <div className="text-[#0d0d0d] text-sm truncate">{file?.name}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step > 0 && (
          <div className="px-6 py-4 border-t border-[#e5e5e5] flex items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              {isUploading && (
                <div className="w-full max-w-md">
                  <div className="flex items-center justify-between text-xs text-[#606060]">
                    <span>Uploading video...</span>
                    {typeof uploadProgress === "number" && Number.isFinite(uploadProgress) && (
                      <span>{uploadProgress}%</span>
                    )}
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#e5e5e5]">
                    <div
                      className={`h-full bg-[#065fd4] transition-all duration-150 ${
                        typeof uploadProgress === "number" && Number.isFinite(uploadProgress)
                          ? ""
                          : "animate-pulse w-1/3"
                      }`}
                      style={
                        typeof uploadProgress === "number" && Number.isFinite(uploadProgress)
                          ? { width: `${uploadProgress}%` }
                          : undefined
                      }
                    ></div>
                  </div>
                  {uploadError && (
                    <div className="mt-2 text-xs text-[#cc0000]">{uploadError}</div>
                  )}
                </div>
              )}
              {!isUploading && step === 3 && (
                <div className="flex items-center gap-2 text-[#606060] text-xs">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>
                  Checks complete. No issues found.
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={isUploading}
                className="px-4 py-2 text-[#606060] font-medium uppercase disabled:cursor-not-allowed disabled:opacity-50 hover:text-[#0d0d0d]"
              >
                Back
              </button>
              <button 
                onClick={() => {
                  if (isUploading) return;
                  if (step < 4) setStep(step + 1);
                  else handlePublish(); // Finish
                }}
                disabled={isUploading}
                className="px-4 py-2 bg-[#065fd4] text-white font-medium rounded-sm uppercase disabled:cursor-not-allowed disabled:opacity-70 hover:bg-[#0056b3]"
              >
                {isUploading ? "Uploading..." : step === 4 ? "Publish" : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
