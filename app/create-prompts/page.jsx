'use client';

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Form from "@components/Form";
// import { POST } from "@app/api/auth/[...nextauth]/route";

const CreatePage = () => {

  const router = useRouter();
  const {data: session} = useSession();
  
  // state for submitting
  const [submitting, setSubmitting] = useState(false);
  // state for the prompts
  const [prompts, setPrompts] = useState({
    prompt: "",
    tag: "",
  })

  // function for crating Prompts
  const createPrompt = async(e)=>{
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/prompt/new',{
        method: 'POST',
        body: JSON.stringify({
          prompt: prompts.prompt,
          userId: session?.user.id,
          tag: prompts.tag
        })
      })

      if(response.ok){
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form 
      type="Create"
      prompts={prompts}
      setPrompts={setPrompts}
      submitting={submitting}
      handleSubmit={createPrompt}
    />
  )
}

export default CreatePage
