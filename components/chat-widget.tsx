"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot, User, Loader2, Maximize2, Minimize2, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  isTyping?: boolean
  displayContent?: string
}

interface ChatSession {
  messages: Message[]
  timestamp: number
  expiresAt: number
}

export function ChatWidget() {
  // Size configuration - tweak these values to adjust widget dimensions
  const WIDGET_SIZES = {
    default: { width: 'w-96', height: 'h-[480px]' },
    maximized: { width: 'w-[500px]', height: 'h-[600px]' }
  }

  // Chat storage configuration
  const CHAT_EXPIRY_HOURS = 1
  const CHAT_STORAGE_KEY = 'blockchainspace_chat_session'

  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Local storage functions
  const getDefaultMessage = (): Message => ({
    id: "1",
    content: "Hi! I'm your blockchain assistant developed by AIRC at Woxsen University. Ask me anything about cryptocurrencies, DeFi, smart contracts, or blockchain technology!",
    sender: "ai",
    timestamp: new Date(),
  })

  const loadChatFromStorage = (): Message[] => {
    if (typeof window === 'undefined') return [getDefaultMessage()]
    
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY)
      if (!stored) return [getDefaultMessage()]

      const session: ChatSession = JSON.parse(stored)
      const now = Date.now()

      // Check if session has expired
      if (now > session.expiresAt) {
        localStorage.removeItem(CHAT_STORAGE_KEY)
        return [getDefaultMessage()]
      }

      // Convert timestamp strings back to Date objects
      const messagesWithDates = session.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))

      return messagesWithDates.length > 0 ? messagesWithDates : [getDefaultMessage()]
    } catch (error) {
      console.error('Error loading chat from storage:', error)
      return [getDefaultMessage()]
    }
  }

  const saveChatToStorage = (messages: Message[]) => {
    if (typeof window === 'undefined') return
    
    try {
      const now = Date.now()
      const session: ChatSession = {
        messages: messages,
        timestamp: now,
        expiresAt: now + (CHAT_EXPIRY_HOURS * 60 * 60 * 1000) // 1 hour from now
      }
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(session))
    } catch (error) {
      console.error('Error saving chat to storage:', error)
    }
  }

  const clearChatStorage = () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(CHAT_STORAGE_KEY)
  }

  const downloadChat = () => {
    const chatText = messages.map(msg => {
      const timestamp = msg.timestamp.toLocaleString()
      const sender = msg.sender === 'ai' ? 'AI Assistant' : 'You'
      return `[${timestamp}] ${sender}: ${msg.content}`
    }).join('\n\n')

    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `blockchain-chat-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearChat = () => {
    const defaultMessage = getDefaultMessage()
    setMessages([defaultMessage])
    clearChatStorage()
  }

  // Initialize chat on component mount
  useEffect(() => {
    if (!isInitialized) {
      const loadedMessages = loadChatFromStorage()
      setMessages(loadedMessages)
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Save chat whenever messages change (but not during initialization)
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      saveChatToStorage(messages)
    }
  }, [messages, isInitialized])

  // Typewriter effect for AI responses
  const startTypewriter = (messageId: string, fullText: string) => {
    setTypingMessageId(messageId)
    let currentIndex = 0
    const typingSpeed = 30 // milliseconds between characters
    
    const typeNextChar = () => {
      if (currentIndex < fullText.length) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, displayContent: fullText.slice(0, currentIndex + 1) }
            : msg
        ))
        currentIndex++
        typingIntervalRef.current = setTimeout(typeNextChar, typingSpeed)
      } else {
        setTypingMessageId(null)
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, isTyping: false, displayContent: fullText }
            : msg
        ))
      }
    }
    
    typeNextChar()
  }

  // Clean up typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearTimeout(typingIntervalRef.current)
      }
    }
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Validate message length (200 words max)
    const wordCount = inputValue.trim().split(/\s+/).length
    if (wordCount > 200) {
      setError("Message too long. Please limit to 200 words.")
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentMessage = inputValue
    setInputValue("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentMessage }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: "ai",
        timestamp: new Date(),
        isTyping: true,
        displayContent: ""
      }
      setMessages((prev) => [...prev, aiResponse])
      
      // Start typewriter effect
      startTypewriter(aiResponse.id, data.message)
    } catch (error) {
      console.error('Chat error:', error)
      setError(error instanceof Error ? error.message : 'Failed to get response')
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-24 right-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 ${
              isMaximized ? `${WIDGET_SIZES.maximized.width} ${WIDGET_SIZES.maximized.height}` : `${WIDGET_SIZES.default.width} ${WIDGET_SIZES.default.height}`
            }`}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">Blockchain Assistant</h3>
                  <p className="text-xs opacity-90">Ask me about crypto & DeFi</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={downloadChat}
                  className="text-white hover:bg-white/20 h-8 w-8"
                  title="Download Chat"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  className="text-white hover:bg-white/20 h-8 w-8"
                  title="Clear Chat"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="text-white hover:bg-white/20 h-8 w-8"
                  title={isMaximized ? "Minimize" : "Maximize"}
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === "ai" && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                        {message.sender === "user" && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                        <p className="text-sm">
                          {message.sender === "ai" && message.isTyping 
                            ? message.displayContent 
                            : message.content
                          }
                          {message.sender === "ai" && message.isTyping && message.id === typingMessageId && (
                            <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse" />
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              {error && (
                <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                  {error}
                </div>
              )}
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    setError(null)
                  }}
                  placeholder="Ask about blockchain... (max 200 words)"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
