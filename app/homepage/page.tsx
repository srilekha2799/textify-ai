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

    <main className="min-h-screen bg-[#EEF4FF] transition-all duration-300 dark:bg-[#020817]">

      {/* Navbar */}
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

  bg-white/90
  px-4
  py-4
  backdrop-blur-md

  transition-all

  dark:border-zinc-800
  dark:bg-[#020817]/90

  sm:px-6
  lg:px-8
"
>

  {/* Logo */}
  <h1
    className="
    text-2xl
    font-extrabold
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

  {/* Desktop Navbar */}
  <div
    className="
    hidden
    items-center
    gap-4

    md:flex
  "
  >

    {/* History */}
    <button
      onClick={() =>
        router.push("/history")
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

    {/* Settings */}
    <button
      onClick={() =>
        router.push("/settings")
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

    {/* Logout */}
    <button
      onClick={handleLogout}
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

  {/* Mobile Navbar */}
  <div
    className="
    flex
    items-center
    gap-3

    md:hidden
  "
  >

    {/* History Icon */}
    <button
      onClick={() =>
        router.push("/history")
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

      transition-all
      hover:scale-110

      dark:border-zinc-700
      dark:bg-[#111827]
    "
    >

      <FileText
        size={20}
        className="
        text-[#5B7CFA]
      "
      />

    </button>

    {/* Settings Icon */}
    <button
      onClick={() =>
        router.push("/settings")
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

      transition-all
      hover:scale-110

      dark:border-zinc-700
      dark:bg-[#111827]
    "
    >

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="
        h-5
        w-5
        text-[#5B7CFA]
      "
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>

    </button>

  </div>

</nav>

      {/* Main */}
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row">

        {/* Input Card */}
        <div className="flex-1 rounded-[32px] bg-white p-8 shadow-2xl dark:bg-[#0F172A]">

          <h2 className="mb-6 text-3xl font-bold text-[#233B95] dark:text-[#8FB3FF]">

            Enter Text

          </h2>

          {/* Textarea */}
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
              h-80
              w-full
              resize-none
              rounded-3xl
              border
              border-gray-300
              bg-[#F8FAFC]
              p-5
              pr-32
              text-lg
              text-gray-800
              outline-none
              transition
              focus:border-[#5B7CFA]

              dark:border-zinc-700
              dark:bg-[#111827]
              dark:text-white
              dark:placeholder:text-zinc-500
            "
            />

            {/* Upload Menu */}
            <div className="absolute bottom-4 right-16">

              <button
                onClick={() =>
                  setShowUploadMenu(
                    !showUploadMenu
                  )
                }
                className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[#5B7CFA]
                text-white
                transition
                hover:bg-[#4A68E8]
              "
              >

                <Paperclip
                  size={20}
                />

              </button>

              {/* Dropdown */}
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
                  border-gray-200
                  bg-white
                  p-3
                  shadow-2xl

                  dark:border-zinc-700
                  dark:bg-[#111827]
                "
                >

                  {/* Camera */}
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

                  {/* Image */}
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

            {/* Mic */}
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

                className={`absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full transition

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

          {/* Simplify */}
          <button
            onClick={
              handleSimplify
            }
            disabled={loading}
            className="mt-7 w-full rounded-3xl bg-[#5B7CFA] py-4 text-lg font-semibold text-white transition hover:bg-[#4A68E8] disabled:opacity-70"
          >

            {loading
              ? "Simplifying..."
              : uploading
              ? "Uploading..."
              : "Simplify Text"}

          </button>
        </div>

        {/* Output Card */}
        <div className="flex-1 rounded-[32px] bg-white p-8 shadow-2xl dark:bg-[#0F172A]">

          <h2 className="mb-6 text-3xl font-bold text-[#233B95] dark:text-[#8FB3FF]">

            AI Response

          </h2>

          <div className="h-80 overflow-y-auto rounded-3xl border border-gray-300 bg-[#F8FAFC] p-5 dark:border-zinc-700 dark:bg-[#111827]">

            {outputText ? (

              <p className="whitespace-pre-wrap leading-8 text-gray-700 dark:text-gray-200">

                {outputText}

              </p>

            ) : (

              <div className="flex h-full items-center justify-center">

                <p className="text-gray-400 dark:text-zinc-500">

                  AI simplified text will appear here...

                </p>

              </div>

            )}

          </div>
        </div>
      </section>
    </main>
  );
}"use client";

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