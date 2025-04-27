import ChatPage from "@/components/chat"
import { dehydrate,HydrationBoundary,QueryClient } from "@tanstack/react-query";


const Chatpage = () => {
  const queryClient = new QueryClient()
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
    <ChatPage/>
    </HydrationBoundary>
  )
}

export default Chatpage