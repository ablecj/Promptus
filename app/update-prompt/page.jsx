'use client';

import { useEffect, useState } from "react";

import { useRouter, useSearchParams} from "next/navigation";
import Form from "@components/Form";
// import { POST } from "@app/api/auth/[...nextauth]/route";

const CreatePage = () => {

  const router = useRouter();
//   const {data: session} = useSession();
const searchParams = useSearchParams();
const promptId = searchParams.get('id')
  
  // state for submitting
  const [submitting, setSubmitting] = useState(false);
  // state for the prompts
  const [prompts, setPrompts] = useState({
    prompt: "",
    tag: "",
  })

  useEffect(()=>{
    const getPromptsDetails = async()=>{
        const response = await fetch(`/api/prompt/${promptId}`);
        const data = await response.json();
            console.log("data from updeate", data)
        setPrompts({
            prompt: data.prompt,
            tag: data.tag,
        })
    }

    if(promptId){
        getPromptsDetails();
    }
  },[promptId])

  // function for crating Prompts
  const updatePrompt = async(e)=>{
    e.preventDefault();
    setSubmitting(true);

    if(!promptId) return alert("Prompt ID is not found")
    
    try {
      const response = await fetch(`/api/prompt/${promptId}`,{
        method: 'PATCH',
        body: JSON.stringify({
          prompt: prompts.prompt,
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
      type="Edit"
      prompts={prompts}
      setPrompts={setPrompts}
      submitting={submitting}
      handleSubmit={updatePrompt}
    />
  )
}

export default CreatePage
