import { fetchOrGenerateUserToken } from "@/utils/action";
import { UserButton } from "@clerk/nextjs";
import {  currentUser } from "@clerk/nextjs/server";

const Member = async() => {
    const user = await currentUser();
   await fetchOrGenerateUserToken(user.id)
  return (
    <div className="px-4 flex items-center gap-2 overflow-auto">
        <UserButton/>
        <p className="">{user.emailAddresses[0].emailAddress}</p>
    </div>
  )
}

export default Member