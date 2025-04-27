'use client'


import { fetchUserTokenById, generateChateResponse, updateUserToken } from '@/utils/action';
import { useUser } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';
import  { useState } from 'react'
import toast from 'react-hot-toast';

const ChatPage = () => {
    const {user}=useUser();
    const [text,setText]=useState('');
    const [messages,setMessages]=useState([]);
    const {mutate,isPending}=useMutation({
        mutationFn:async(query)=>{
       const currenttokens = await fetchUserTokenById(user.id);
      if(currenttokens<200){
        toast.error('not enough tokens to generate a new tour')
        return ;
      }
      const response = await generateChateResponse([...messages,query]);
      if(!response){
        toast.error("something went wrong")
        return;
      }
      setMessages((prev)=>[...prev,response.message])
      const newTokens = await updateUserToken(user.id,response.tokens)
      toast.success(`${newTokens} tokens remaining...`);
        }
        
    })
    const handleSubmit =(e)=>{
        e.preventDefault();
        setText('');
        const query = {role:'user', content:text}
        mutate(query);
        setMessages((prev)=>[...prev,query])
    }

  return (
    <div className='min-h-[calc(100vh-6rem)] grid grid-rows-[1fr_auto]'>
        <div>
            {messages.map(({role,content},index)=>{
                const avatar = role == 'user' ? '👤' : '🤖';
                const bcg = role =='user'?'bg-base-200':'bg-base-100';
                return <div key={index} className={`${bcg} flex py-6 text-xl leading-loose mx-8 px-8 border-b border-base-300`}>
                    <span className='mr-4'>{avatar}</span>
                    <p className='max-w-3xl'>{content}</p>
                        </div> 
            })}
            {isPending?<span className='loading mx-auto'></span>:null}
        </div>
        <form onSubmit={handleSubmit} className='max-w-4xl pt-12'>
            <div className='join w-full'>
                <input type="text" placeholder='message genius gpt'className='input input-bordered joinitem w-full' value={text} required onChange={(e)=>setText(e.target.value)} />
                <button className='btn btn-primary join-item' type='submit' disabled={isPending}>{isPending?'please wait...':'Ask Question'}</button>

            </div>
        </form>
    </div>
  )
}

export default ChatPage