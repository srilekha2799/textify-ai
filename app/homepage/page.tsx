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
  Sparkles,
  Send,
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

      bg-[#EEF4FF]

      text-black

      transition-all
      duration-300

      dark:bg-[#020817]
      dark:text-white
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
        border-gray-200

        bg-white/80
        px-4
        py-4

        backdrop-blur-xl

        dark:border-zinc-800
        dark:bg-[#020817]/80

        sm:px-6
        lg:px-10
      "
      >

        {/* LOGO */}
        <h1
          className="
          text-2xl
          font-black
          tracking-wide

          bg-gradient-to-r
          from-[#5B7CFA]
          via-[#7C5CFF]
          to-[#38BDF8]

          bg-clip-text
          text-transparent

          sm:text-3xl
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
            rounded-2xl

            border
            border-gray-300

            bg-white

            px-5
            py-2

            font-medium
            text-gray-700

            transition-all
            hover:scale-105
            hover:bg-gray-100

            dark:border-zinc-700
            dark:bg-[#111827]
            dark:text-white
            dark:hover:bg-zinc-800
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
            rounded-2xl

            border
            border-gray-300

            bg-white

            px-5
            py-2

            font-medium
            text-gray-700

            transition-all
            hover:scale-105
            hover:bg-gray-100

            dark:border-zinc-700
            dark:bg-[#111827]
            dark:text-white
            dark:hover:bg-zinc-800
          "
          >
            Settings
          </button>

          <button
            onClick={
              handleLogout
            }

            className="
            rounded-2xl

            bg-gradient-to-r
            from-[#5B7CFA]
            to-[#4A68E8]

            px-5
            py-2

            font-medium
            text-white

            transition-all
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
            border-gray-300

            bg-white

            dark:border-zinc-700
            dark:bg-[#111827]
          "
          >

            <History
              size={20}
              className="
              text-[#5B7CFA]
            "
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
            border-gray-300

            bg-white

            dark:border-zinc-700
            dark:bg-[#111827]
          "
          >

            <Settings
              size={20}
              className="
              text-[#5B7CFA]
            "
            />

          </button>

        </div>

      </nav>

      {/* MAIN CHAT AREA */}
      <section
        className="
        mx-auto

        flex
        max-w-6xl
        flex-col

        gap-6

        px-4
        py-6

        sm:px-6
        lg:px-10
      "
      >

        {/* AI RESPONSE */}
        <div
          className="
          min-h-[55vh]

          rounded-[32px]

          border
          border-gray-200

          bg-white

          p-6

          shadow-xl

          transition-all

          dark:border-zinc-800
          dark:bg-[#0F172A]
        "
        >

          <div
            className="
            mb-5

            flex
            items-center
            gap-3
          "
          >

            <div
              className="
              flex
              h-11
              w-11
              items-center
              justify-center

              rounded-full

              bg-gradient-to-r
              from-[#5B7CFA]
              to-[#7C5CFF]

              text-white
            "
            >

              <Sparkles
                size={20}
              />

            </div>

            <div>

              <h2
                className="
                text-xl
                font-bold

                text-[#233B95]

                dark:text-[#8FB3FF]
              "
              >
                AI Response
              </h2>

              <p
                className="
                text-sm
                text-gray-500

                dark:text-zinc-400
              "
              >
                smarter simplification ✨
              </p>

            </div>

          </div>

          {/* RESPONSE AREA */}
          <div
            className="
            flex
            min-h-[40vh]
            items-start

            rounded-3xl

            bg-[#F8FAFC]

            p-5

            dark:bg-[#111827]
          "
          >

            {outputText ? (

              <p
                className="
                whitespace-pre-wrap

                text-[15px]
                leading-8

                text-gray-700

                dark:text-gray-200
              "
              >
                {outputText}
              </p>

            ) : (

              <div
                className="
                flex
                w-full
                flex-col
                items-center
                justify-center

                py-20
              "
              >

                <div
                  className="
                  mb-4

                  flex
                  h-16
                  w-16
                  items-center
                  justify-center

                  rounded-full

                  bg-gradient-to-r
                  from-[#5B7CFA]
                  to-[#7C5CFF]

                  text-white
                "
                >

                  <Sparkles
                    size={28}
                  />

                </div>

                <p
                  className="
                  text-center
                  text-gray-400

                  dark:text-zinc-500
                "
                >
                  AI simplified text
                  will appear here...
                </p>

              </div>

            )}

          </div>

        </div>

        {/* INPUT AREA */}
        <div
          className="
          rounded-[32px]

          border
          border-gray-200

          bg-white

          p-4

          shadow-xl

          dark:border-zinc-800
          dark:bg-[#0F172A]
        "
        >

          <textarea
            placeholder="Ask Textify to simplify anything..."
            value={inputText}
            onChange={(e) =>
              setInputText(
                e.target.value
              )
            }

            className="
            min-h-[120px]
            w-full

            resize-none

            rounded-3xl

            bg-[#F8FAFC]

            p-5

            text-[16px]
            text-gray-700

            outline-none

            transition-all

            placeholder:text-gray-400

            dark:bg-[#111827]
            dark:text-white
            dark:placeholder:text-zinc-500
          "
          />

          {/* ACTIONS */}
          <div
            className="
            mt-4

            flex
            items-center
            justify-between
          "
          >

            {/* LEFT */}
            <div
              className="
              flex
              items-center
              gap-3
            "
            >

              {/* UPLOAD */}
              <div className="relative">

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
                    left-0

                    flex
                    w-52
                    flex-col
                    gap-2

                    rounded-2xl

                    border
                    border-gray-200

                    bg-white

                    p-3

                    shadow-2xl

                    dark:border-zinc-700
                    dark:bg-[#111827]
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

                      text-gray-700

                      transition
                      hover:bg-gray-100

                      dark:text-white
                      dark:hover:bg-zinc-800
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

                      text-gray-700

                      transition
                      hover:bg-gray-100

                      dark:text-white
                      dark:hover:bg-zinc-800
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

                      text-gray-700

                      transition
                      hover:bg-gray-100

                      dark:text-white
                      dark:hover:bg-zinc-800
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
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center

                  rounded-full

                  transition-all

                  ${
                    listening
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-[#5B7CFA] text-white"
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

            {/* SEND */}
            <button
              onClick={
                handleSimplify
              }

              disabled={loading}

              className="
              flex
              items-center
              gap-2

              rounded-2xl

              bg-gradient-to-r
              from-[#5B7CFA]
              to-[#7C5CFF]

              px-5
              py-3

              font-semibold
              text-white

              transition-all
              hover:scale-105

              disabled:opacity-70
            "
            >

              <Send
                size={18}
              />

              {loading
                ? "Simplifying..."
                : uploading
                ? "Uploading..."
                : "Simplify"}

            </button>

          </div>

        </div>

      </section>

    </main>
  );
}