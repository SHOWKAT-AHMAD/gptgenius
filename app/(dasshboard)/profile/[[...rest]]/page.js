import { fetchOrGenerateUserToken } from "@/utils/action"
import { UserProfile } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"


const profilePage = async() => {
  const user = await currentUser();
   const currentTokens=await fetchOrGenerateUserToken(user.id);
   console.log(currentTokens)
    return (<>
      <h2 className='mb-8 ml-8 text-xl font-extrabold'>
        Token Amount : {currentTokens}
      </h2>
      <UserProfile />
      </>
    )
  }
  
  export default profilePage