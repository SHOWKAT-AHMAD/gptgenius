'use client'
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { getExistingTour,
  CreateNewTour,createTourResponse,
  
  updateUserToken,
  fetchUserTokenById
 } from "@/utils/action";
 import TourInfo from "./TourInfo";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

const NewTour = () => {
  const {user}=useUser()
  const queryClient = useQueryClient();
  const {mutate,isPending,data:tour}= useMutation({
    mutationFn:async (destination)=>{
      const existingTour = await getExistingTour(destination);
      if(existingTour) return existingTour;
      const currenttokens = await fetchUserTokenById(user.id);
      if(currenttokens<500){
        toast.error('not enough tokens to generate a new tour')
        return null;
      }
      // console.log("after existiong")
      const newTour=await createTourResponse(destination)
      if(!newTour){
        toast.error('no matching city found...')
      return null;
      }
      await CreateNewTour(newTour.tour)
      queryClient.invalidateQueries({queryKey:['tours']})
      const newTokens = await updateUserToken(user.id,newTour.tokens);
      toast.success(`${newTokens} tokens remaining...`);
        return newTour.tour
    }
  })
    const handlesubmit = (e)=>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        const destination = Object.fromEntries(formData.entries());
        mutate(destination)
    };
    if(isPending){
        return <span className="loading loading-lg"/>
          }
  return (
    <>
    <form onSubmit={handlesubmit} className="max-w-2xl">
        <h2 className="mb-4">Select your dream destination</h2>
        <div className="join w-full">
            <input type="text" className="input input-bordered join-item w-full" 
            placeholder="city"
            name="city"
            required />
            <input type="text" className="input input-bordered join-item w-full" 
            placeholder="country"
            name="country"
            required />
            <button className="btn btn-primary join-item" type="submit">Generate Tour</button>
        </div>
    </form>
    <div className="mt-16">
        {tour? <TourInfo tour={tour}/> :null}
    </div>
    </>
  )
}

export default NewTour;