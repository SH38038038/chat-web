import { createBrowserRouter, Navigate } from 'react-router'
import { RequireAuth } from '@/features/auth/ui/RequireAuth'
import { AppLayout } from '@/app/AppLayout'
import { LoginPage } from '@/pages/login/LoginPage'
import { SignupPage } from '@/pages/signup/SignupPage'
import { ChatListLayout } from '@/pages/chat/ChatListLayout'
import { ChatEmptyPage } from '@/pages/chat/ChatEmptyPage'
import { ChatRoomPage } from '@/pages/chat/ChatRoomPage'
import { FriendsPage } from '@/pages/friends/FriendsPage'
import { OpenChatPage } from '@/pages/openchat/OpenChatPage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/chats" replace /> },
          {
            path: 'chats',
            element: <ChatListLayout />,
            children: [
              { index: true, element: <ChatEmptyPage /> },
              { path: ':roomId', element: <ChatRoomPage /> },
            ],
          },
          { path: 'friends', element: <FriendsPage /> },
          { path: 'open-chats', element: <OpenChatPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
