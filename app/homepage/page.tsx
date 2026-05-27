"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  Mic,
  MicOff,
  Paperclip,
  Camera,
  ImagePlus,
  FileText,
  History,
  Settings,
} from "lucide-react";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function Homepage() {

  const router = useRouter();

  const [inputText, setInputText] =
    useState("");

  const [outputText, setOutputText] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  const [
    showUploadMenu,
    setShowUploadMenu,
  ] = useState(false);

  useEffect(() => {

    setMounted(true);

  }, []);

  // Speech Recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Voice → Text
  useEffect(() => {

    if (transcript) {

      setInputText(transcript);
    }

  }, [transcript]);

  // Logout
  const handleLogout = async () => {

    await supabase.auth.signOut();

    router.push("/login");
  };

  // Image Upload OCR
  const handleImageUpload =
    async (file: File) => {

      setUploading(true);

      try {

        const Tesseract =
          (
            await import(
              "tesseract.js"
            )
          ).default;

        const {
          data: { text },
        } =
          await Tesseract.recognize(
            file,
            "eng"
          );

        setInputText(text);

      } catch (error) {

        console.log(error);

        alert(
          "Image scan failed"
        );
      }

      setUploading(false);
    };

  // PDF Upload
  const handlePDFUpload =
    async (file: File) => {

      setUploading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      try {

        const response =
          await fetch(
            "/api/upload-pdf",
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await response.json();

        if (data.text) {

          setInputText(
            data.text
          );

        } else {

          alert(
            data.error ||
              "PDF upload failed"
          );
        }

      } catch (error) {

        console.log(error);

        alert(
          "PDF upload failed"
        );
      }

      setUploading(false);
    };

  // Simplify Text
  const handleSimplify =
    async () => {

      if (!inputText) {

        alert(
          "Please enter text"
        );

        return;
      }

      setLoading(true);

      try {

        const response =
          await fetch(
            "/api/simplify",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                text: inputText,
              }),
            }
          );

        const data =
          await response.json();

        setOutputText(
          data.result ||
            "No response generated"
        );

        // Current User
        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        // Save History
        if (user) {

          await supabase
            .from("history")
            .insert([
              {
                user_id:
                  user.id,

                input_text:
                  inputText,

                output_text:
                  data.result,
              },
            ]);
        }

      } catch (error) {

        console.log(error);

        alert(
          "Something went wrong"
        );
      }

      setLoading(false);
    };

  return (

    <main
      className="
      min-h-screen

      bg-gradient-to-br
      from-[#020817]
      via-[#071330]
      to-[#020817]

      text-white
    "
    >

      {/* NAVBAR */}

      <nav
        className="
        sticky
        top-0
        z-50

        flex
        items-center
        justify-between

        border-b
        border-white/10

        bg-[#020817]/80
        px-4
        py-4

        backdrop-blur-xl

        md:px-8
      "
      >

        {/* LOGO */}

        <h1
          className="
          text-3xl
          font-black

          md:text-5xl

          bg-gradient-to-r
          from-[#8FB3FF]
          via-[#5B7CFA]
          to-[#233B95]

          bg-clip-text
          text-transparent
        "
        >
          Textify
        </h1>

        {/* DESKTOP NAV */}

        <div
          className="
          hidden
          items-center
          gap-4

          md:flex
        "
        >

          <button
            onClick={() =>
              router.push(
                "/history"
              )
            }

            className="
            rounded-full

            border
            border-white/10

            bg-white/5

            px-6
            py-3

            font-medium

            transition-all
            duration-300

            hover:bg-white/10
          "
          >
            History
          </button>

          <button
            onClick={() =>
              router.push(
                "/settings"
              )
            }

            className="
            rounded-full

            border
            border-white/10

            bg-white/5

            px-6
            py-3

            font-medium

            transition-all
            duration-300

            hover:bg-white/10
          "
          >
            Settings
          </button>

          <button
            onClick={
              handleLogout
            }

            className="
            rounded-full

            bg-gradient-to-r
            from-[#5B7CFA]
            to-[#4A68E8]

            px-6
            py-3

            font-semibold

            transition-all
            duration-300

            hover:scale-105
          "
          >
            Logout
          </button>

        </div>

        {/* MOBILE NAV */}

        <div
          className="
          flex
          items-center
          gap-3

          md:hidden
        "
        >

          <button
            onClick={() =>
              router.push(
                "/history"
              )
            }

            className="
            flex
            h-11
            w-11
            items-center
            justify-center

            rounded-full

            border
            border-white/10

            bg-white/5

            text-[#8FB3FF]
          "
          >

            <History
              size={20}
            />

          </button>

          <button
            onClick={() =>
              router.push(
                "/settings"
              )
            }

            className="
            flex
            h-11
            w-11
            items-center
            justify-center

            rounded-full

            border
            border-white/10

            bg-white/5

            text-[#8FB3FF]
          "
          >

            <Settings
              size={20}
            />

          </button>

        </div>

      </nav>

      {/* MAIN CONTENT */}

      <section
        className="
        mx-auto

        flex
        max-w-7xl
        flex-col
        gap-6

        px-4
        py-6

        md:px-8
        md:py-10

        lg:flex-row
      "
      >

        {/* INPUT SECTION */}

        <div
          className="
          flex-1

          rounded-[32px]

          border
          border-white/10

          bg-white/5

          p-5

          shadow-[0_0_40px_rgba(91,124,250,0.12)]

          backdrop-blur-xl

          md:p-8
        "
        >

          <h2
            className="
            mb-5

            text-2xl
            font-bold

            text-[#8FB3FF]

            md:text-3xl
          "
          >
            Enter Text
          </h2>

          {/* TEXTAREA */}

          <div className="relative">

            <textarea
              placeholder="Enter text..."

              value={inputText}

              onChange={(e) =>
                setInputText(
                  e.target.value
                )
              }

              className="
              h-52
              w-full

              resize-none

              rounded-3xl

              border
              border-white/10

              bg-[#0B1120]

              p-5
              pr-28

              text-base
              text-white

              outline-none

              transition-all

              placeholder:text-zinc-500

              focus:border-[#5B7CFA]

              md:h-72
              md:text-lg
            "
            />

            {/* UPLOAD */}

            <div
              className="
              absolute
              bottom-4
              right-16
            "
            >

              <button
                onClick={() =>
                  setShowUploadMenu(
                    !showUploadMenu
                  )
                }

                className="
                flex
                h-11
                w-11
                items-center
                justify-center

                rounded-full

                bg-[#5B7CFA]

                text-white

                transition-all
                duration-300

                hover:scale-105
              "
              >

                <Paperclip
                  size={20}
                />

              </button>

              {/* DROPDOWN */}

              {showUploadMenu && (

                <div
                  className="
                  absolute
                  bottom-14
                  right-0

                  flex
                  w-52
                  flex-col
                  gap-2

                  rounded-2xl

                  border
                  border-white/10

                  bg-[#0B1120]

                  p-3

                  shadow-2xl
                "
                >

                  {/* CAMERA */}

                  <label
                    className="
                    flex
                    cursor-pointer
                    items-center
                    gap-3

                    rounded-xl

                    px-3
                    py-3

                    text-sm
                    font-medium

                    text-white

                    transition-all

                    hover:bg-white/10
                  "
                  >

                    <Camera
                      size={18}
                    />

                    Open Camera

                    <input
                      type="file"
                      accept="image/*"
                      capture
                      className="hidden"

                      onChange={(e) => {

                        const file =
                          e.target
                            .files?.[0];

                        if (file) {

                          handleImageUpload(
                            file
                          );

                          setShowUploadMenu(
                            false
                          );
                        }
                      }}
                    />

                  </label>

                  {/* IMAGE */}

                  <label
                    className="
                    flex
                    cursor-pointer
                    items-center
                    gap-3

                    rounded-xl

                    px-3
                    py-3

                    text-sm
                    font-medium

                    text-white

                    transition-all

                    hover:bg-white/10
                  "
                  >

                    <ImagePlus
                      size={18}
                    />

                    Upload Image

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"

                      onChange={(e) => {

                        const file =
                          e.target
                            .files?.[0];

                        if (file) {

                          handleImageUpload(
                            file
                          );

                          setShowUploadMenu(
                            false
                          );
                        }
                      }}
                    />

                  </label>

                  {/* PDF */}

                  <label
                    className="
                    flex
                    cursor-pointer
                    items-center
                    gap-3

                    rounded-xl

                    px-3
                    py-3

                    text-sm
                    font-medium

                    text-white

                    transition-all

                    hover:bg-white/10
                  "
                  >

                    <FileText
                      size={18}
                    />

                    Upload PDF

                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"

                      onChange={(e) => {

                        const file =
                          e.target
                            .files?.[0];

                        if (file) {

                          handlePDFUpload(
                            file
                          );

                          setShowUploadMenu(
                            false
                          );
                        }
                      }}
                    />

                  </label>

                </div>
              )}

            </div>

            {/* MIC */}

            {mounted &&
              browserSupportsSpeechRecognition && (

              <button
                onClick={() => {

                  if (
                    listening
                  ) {

                    SpeechRecognition.stopListening();

                  } else {

                    resetTranscript();

                    SpeechRecognition.startListening(
                      {
                        continuous: true,
                      }
                    );
                  }
                }}

                className={`

                absolute
                bottom-4
                right-4

                flex
                h-11
                w-11
                items-center
                justify-center

                rounded-full

                transition-all

                ${
                  listening
                    ? "bg-red-500 animate-pulse"
                    : "bg-[#5B7CFA]"
                }
                `}
              >

                {listening ? (
                  <MicOff
                    size={20}
                  />
                ) : (
                  <Mic
                    size={20}
                  />
                )}

              </button>
            )}

          </div>

          {/* BUTTON */}

          <button
            onClick={
              handleSimplify
            }

            disabled={loading}

            className="
            mt-6

            w-full

            rounded-3xl

            bg-gradient-to-r
            from-[#5B7CFA]
            to-[#4A68E8]

            py-4

            text-lg
            font-semibold

            text-white

            transition-all
            duration-300

            hover:scale-[1.02]

            disabled:opacity-70
          "
          >

            {loading
              ? "Simplifying..."
              : uploading
              ? "Uploading..."
              : "Simplify Text"}

          </button>

        </div>

        {/* OUTPUT SECTION */}

        <div
          className="
          flex-1

          rounded-[32px]

          border
          border-white/10

          bg-white/5

          p-5

          shadow-[0_0_40px_rgba(91,124,250,0.12)]

          backdrop-blur-xl

          md:p-8
        "
        >

          <h2
            className="
            mb-5

            text-2xl
            font-bold

            text-[#8FB3FF]

            md:text-3xl
          "
          >
            AI Response
          </h2>

          <div
            className="
            h-52

            overflow-y-auto

            rounded-3xl

            border
            border-white/10

            bg-[#0B1120]

            p-5

            md:h-72
          "
          >

            {outputText ? (

              <p
                className="
                whitespace-pre-wrap

                leading-8

                text-gray-200
              "
              >
                {outputText}
              </p>

            ) : (

              <div
                className="
                flex
                h-full
                items-center
                justify-center
              "
              >

                <p
                  className="
                  text-zinc-500
                "
                >
                  AI simplified text
                  will appear here...
                </p>

              </div>
            )}

          </div>

        </div>

      </section>

    </main>
  );
}