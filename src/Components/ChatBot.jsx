import { useState, useEffect, useRef, useMemo } from "react";
import { openai } from "../openAI_config";
import "../custom styles/ChatBot.css";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import SettingsIcon from "@mui/icons-material/Settings";
import TelegramIcon from "@mui/icons-material/Telegram";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Tooltip } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import { signOut } from "firebase/auth";
import { auth } from "../firebase_config";
import Logout from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import LinearProgress from "@mui/material/LinearProgress";
import { motion, AnimatePresence } from "framer-motion";

function ChatBot({ name, profile }) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [chatLog, setChatLog] = useState(() => {
    // Load chat log from localStorage if available, or return an empty array
    const storedChatLog = localStorage.getItem("chatLog");
    return storedChatLog ? JSON.parse(storedChatLog) : [];
  });
  const messagesEndRef = useRef(null);
  const refreshPage = useRef(null);
  const [spinReload, setSpinReload] = useState(false);

  //chatbot default messages
  const welcomeMessages = ['How may I assist you Today?', 'Feel free to ask me any questions', "Hey there! I'm a friendly chatbot", "I'm your virtual assistant. I'm here to make your life easier", " I'm a chatbot designed to make your time here enjoyable and productive.", "Ask me anything and I'll do my best to assist you.", "Hit me with your questions!", "Hey there hot stuff, welcome to the chatbot world!", "Welcome to the club, my friend! I'm your friendly chatbot bartender", "Fellow human! Welcome to the chatbot party where the fun never stops.", "Yo, yo, yo! I'm your friendly neighborhood chatbot and I'm here to assist you with whatever you need.", "Namaste! I'm your welcome chatbot, here to help you achieve inner Peace", " I'm the chatbot version of Yoda, here to provide you with my wisdom and guidance. Ask me something, you must!", "Oh, great. Another human to entertain.", "Hey there, hotshot! Ready to make some moves?"]
  
  const [changeWelcomeMessage, setChangeWelcomeMessage] = useState(false)
  const showMessage = useMemo(() => {
    console.log('called')
    return welcomeMessages[Math.floor(Math.random()*welcomeMessages.length)]
  },[changeWelcomeMessage])


  useEffect(() => {
    localStorage.setItem("chatLog", JSON.stringify(chatLog));
  }, [chatLog]);

  const fetchData = async () => {
    if (!inputValue) {
      return;
    }

    try {
      setInputValue("");
      setIsLoading(true);
      chatLog.push({ role: "user", content: `${inputValue}` });
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [...chatLog, { role: "user", content: `${inputValue}` }],
      });
      setError(false);
      setIsLoading(false);
      const chatbotResponse = response.data.choices[0].message.content;
      setChatLog([...chatLog, { role: "assistant", content: chatbotResponse }]);
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      console.log(err)
    }
  };

  useEffect(() => {
    messagesEndRef.current &&
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [fetchData, chatLog]);

  return (
    <div className="max-w-[1020px] h-full max-h-[800px] w-full mx-auto grid grid-cols-[4rem,1fr] text-white rounded-2xl overflow-hidden bg-modal">
      <div className="flex flex-col justify-between items-center py-4 border-r border-[rgba(255,255,255,.08)]">
        {profile ? (
          <img className="w-9 rounded-[50%]" src={profile} />
        ) : (
          <img className="w-8 rounded-[50%]" src="assets/logo.svg" />
        )}
        <div className="flex flex-col gap-5 mb-3">
          <ul className="flex flex-col gap-[2px]">
            <li>
              <a
                href="https://www.linkedin.com/in/vishalsah-webdev"
                target="_blank"
              >
                <Tooltip title="LinkedIn" placement="right">
                  <LinkedInIcon
                    style={{ width: "1.3rem", transition: "opacity 150ms" }}
                    className="opacity-50 hover:opacity-100"
                  />
                </Tooltip>
              </a>
            </li>
            <li>
              <a href="https://github.com/vishal-gg" target="_blank">
                <Tooltip title="GitHub" placement="right">
                  <GitHubIcon
                    style={{ width: "1.3rem", transition: "opacity 150ms" }}
                    className="opacity-50 hover:opacity-100"
                  />
                </Tooltip>
              </a>
            </li>
            <li>
              <a href="https://t.me/viPixels" target="_blank">
                <Tooltip title="Telegram" placement="right">
                  <TelegramIcon
                    style={{ width: "1.3rem", transition: "opacity 150ms" }}
                    className="opacity-50 hover:opacity-100"
                  />
                </Tooltip>
              </a>
            </li>
          </ul>
          <hr className="bg-[rgba(255,255,255,.2)] h-[1px] border-none" />
          <button>
            <SettingsIcon
              style={{ transition: "opacity 150ms" }}
              onClick={() => setOpen(!open)}
              className="opacity-50 hover:opacity-100"
            />
          </button>
        </div>
      </div>
      <main className="relative h-full overflow-y-auto">
        <div className="h-full overflow-y-auto pt-[max(5rem,8%)] pb-[max(6rem,12%)]">
          <div>
            <header className="flex justify-between items-center p-4 absolute top-0 left-0 w-full z-50">
              <h1 style={{ fontWeight: "600", fontSize: "1.3rem" }}>Chat</h1>
              <button
                style={{ transition: "all 150ms" }}
                onClick={() => {
                  setChatLog([]);
                  chatLog.length && setChangeWelcomeMessage(!changeWelcomeMessage)
                }}
                className="py-1 rounded-3xl px-2 border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.1)] flex justify-center items-center hover:bg-transparent"
              >
                <AddCircleOutlineIcon
                  style={{ width: "1.1rem", marginRight: "4px" }}
                />{" "}
                New Chat
              </button>
              <div className="separator absolute bottom-0 left-0"></div>
            </header>
            <div className="px-[15%]">
              {chatLog.length > 0 ? (
                <ul>
                  {chatLog.map((msg, index) => (
                    <li
                      style={{ whiteSpace: "break-spaces" }}
                      key={index}
                      className={`relative ${
                        msg.role === "user" ? "bg-[#4B4471]" : "bg-[#343145]"
                      } mb-4 py-3 px-4 w-fit rounded-lg`}
                    >
                      {msg.content}
                      {isLoading && index === chatLog.length - 1 ? (
                        <LinearProgress
                          color="secondary"
                          className="-bottom-6 -left-[2px] rounded-md"
                          style={{ height: "2px" }}
                        />
                      ) : null}
                      <img
                        className="w-5 absolute -left-6 top-1"
                        src={
                          msg.role === "user"
                            ? "assets/user.png"
                            : "assets/bot.ico"
                        }
                        alt="profile"
                      />
                    </li>
                  ))}
                  <span ref={messagesEndRef} />
                </ul>
              ) : (
                <div className="flex flex-col justify-center items-center h-[60vh]">
                    <motion.h1
                    initial={{ opacity: 0, scale: 0}}
                    animate={{ opacity: 1, scale: 1}}
                    transition={{ delay: .6 }}
                    className="z-30 text-center text-base text-amber-300 mb-3"
                  >
                    {showMessage}
                  </motion.h1>
                  <motion.img
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, type: "spring", bounce: 0.6 }}
                    src="assets/welcome_bot.png"
                    draggable={false}
                  />
                
                </div>
              )}
            </div>
          </div>
          <div className="input-section absolute bottom-0 left-0 w-full py-4 px-8 bg-[#120E22]">
            {!error ? (
              <div>
                <input
                  className="w-full h-12 rounded-xl pl-4 pr-16 bg-[#292637] 
                focus:outline focus:-outline-offset-1 focus:outline-white text-white"
                  type="text"
                  value={inputValue}
                  placeholder="Write your message..."
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && fetchData()}
                />
                <button
                  className={`absolute right-10 top-6 bg-blue-300 rounded-lg cursor-pointer p-1 opacity-${
                    isLoading ? 50 : 100
                  }`}
                  disabled={isLoading}
                  onClick={fetchData}
                >
                  <TelegramIcon className="text-[initial]" />
                </button>
              </div>
            ) : (
              <div className="text-red-600 text-center">
                {error}{" "}
                <motion.svg
                  initial={{ rotate: 0 }}
                  animate={spinReload ? { rotate: 360 } : {}}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  onClick={() => {
                    setSpinReload(true);
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 inline-block cursor-pointer text-[#ffffff80]">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </motion.svg>
              </div>
            )}
          </div>
        </div>
      </main>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed"
            exit={{ opacity: 0 }}
          >
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={true}
            >
              <div className="w-[max(23vw,13rem)] h-[max(28vh,10rem)] rounded-md bg-[#363B59] border border-slate-600 flex flex-col items-center justify-center gap-3 relative">
                <CloseIcon
                  onClick={() => setOpen(!open)}
                  style={{ transition: "all 150ms" }}
                  className="absolute top-1 right-1 cursor-pointer text-red-500 hover:bg-red-500 hover:text-white rounded-sm"
                />
                <h2 className="text-3xl font-bold text-[#9EA2BA]">
                  <Logout />
                  Logout
                </h2>
                <p>Do you want to logout?</p>
                <div className="w-2/3 grid grid-cols-2 gap-3">
                  <button
                    className="text-[#363B59] bg-[#8388A4] rounded-[4px] py-2 font-semibold hover:shadow-xl"
                    onClick={() => setOpen(!open)}
                  >
                    cancel
                  </button>
                  <button
                    className="bg-red-500 rounded-[4px] font-semibold hover:shadow-xl"
                    onClick={() => {
                      signOut(auth);
                      localStorage.removeItem("chatLog");
                    }}
                  >
                    okay
                  </button>
                </div>
              </div>
            </Backdrop>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatBot;
