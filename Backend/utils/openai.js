import 'dotenv/config'

const getOpenAIAPIResponse = async (message) => {

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.SigmaGpt}`
        },
        body: JSON.stringify({
            model: 'gpt-5-mini',
            messages: [{
                role: 'user',
                content: message
            }]
        })
    }
    
    try{
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const data = await response.json();
        return data.choices[0].message.content
    } catch (err){
        console.log(err);
        throw(err);
    }
}

export default getOpenAIAPIResponse;