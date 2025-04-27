'use server'

import { revalidatePath } from "next/cache";
import  prisma  from "./db";
import OpenAI from "openai";


const openai = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey:process.env.OPENAI_API_KEY,

})
export const generateChateResponse=async(chatMessages)=>{
    try{
    const response = await openai.chat.completions.create({
        messages:[
            {role:'system',content:'you are a helpful asistant'},
        ...chatMessages
        ],
        model:"gpt-4o",
        temperature:0,
        max_tokens:100,
    });
    return {message:response.choices[0].message,tokens:response.usage.total_tokens};
} catch (error){
    return null;
}
}

export const createTourResponse = async({city,country}) => {
    const query = `Find a ${city} in this ${country}.
    If ${city} in this ${country} exists, create a list of things families can do in this ${city},${country}. 
    Once you have a list, create a one-day tour. Response should be in the following JSON format: 
    {
        "tour": {
            "city": "${city}",
            "country": "${country}",
            "title": "title of the tour",
            "description": "description of the city and tour",
            "stops": ["short paragraph on the stop 1 ", "short paragraph on the stop 2","short paragraph on the stop 3"]
            }
            }
            If you can't find info on exact ${city}, or ${city} does not exist, or it's population is less than 1, or it is not located in the following ${country} return { "tour": null }, with no additional characters.`; 
            // console.log("Sending query to OpenAI:", query);
            try {
                const response = await openai.chat.completions.create({
                    messages:[
                        {role:'system',content:'you are a tour guide'},
                        {role:'user', content:query}
                    ],
                    model:"gpt-4o",
                    temperature:0,
                    
                });
                let content = response.choices[0].message.content;
                // console.log("Raw response from OpenAI:", content);
        
                // Remove Markdown code block formatting if present
                content = content.replace(/```json/g, "").replace(/```/g, "").trim();
                const tourData = JSON.parse(content);
                // console.log("Received response from OpenAI:", tourData);
                if(!tourData.tour){
                    return null
                }
                return {tour:tourData.tour,tokens:response.usage.total_tokens};
            } catch (error) {
                // console.error("Error parsing OpenAI response:", error);
                return null
            }
        };
export const getExistingTour = async({city,country})=>{
            return prisma.tour.findUnique({
                where:{
                    city_country:{
                        city,
                        country,
                    }
                }
            })
        };
export const CreateNewTour = async (tour)=>{
return prisma.tour.create({
    data:tour,
})
};

export const getAllTours = async (searchTerm)=>{
    if(!searchTerm){
        const tours = await prisma.tour.findMany({
            orderBy:{
                city:'asc'
            }
        })
        return tours;
    }
    const tours = await prisma.tour.findMany({
        where:{
            OR:[
                {
                
                city:{
                    contains:searchTerm,
                   
                },
                country:{
                    contains:searchTerm,
                }
            }
            ]
        }
    })
    return tours;
}

export const getSingleTour = async (id)=>{
    return prisma.tour.findUnique({
        where:{
            id,
        },
    });
};

 export const generateTourImage = async({city,country})=>{
    try {
        const tourImage = await openai.images.generate({
            prompt:`a panoramic view of the ${city} ${country}`,
            n:1,
            size:'512x512'
        })
        return tourImage?.data[0]?.url;
    } catch (error) {
        return null;
    }
}

export const fetchUserTokenById = async(clerkid)=>{
    const result = await prisma.tokens.findUnique({
        where:{
            clerkid
        },
    });
    return result?.tokens;
}
export  const generateUserTokenById = async(clerkid)=>{
    const result = await prisma.tokens.create({
        data:{
            clerkid,
        }
    })
    return result?.tokens;
}

export const fetchOrGenerateUserToken = async(clerkid)=>{
    
    const result=await fetchUserTokenById(clerkid);
    if(result){
         return result;
    }
    return await generateUserTokenById(clerkid);
}

export const updateUserToken = async(clerkid, tokens)=>{
    const result = await prisma.tokens .update({
        where:{
            clerkid
        },
        data:{
            tokens:{
                decrement:tokens
            }
        }
    });
    revalidatePath('/profile')
    return result?.tokens;
}


