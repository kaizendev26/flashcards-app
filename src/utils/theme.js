import $ from "../utils/getSelectorDOM";


const theme = ()=>{
    const theme = $("html").get().dataset.theme
    if(theme == "dark"){
        return {
            bgColor: "bg-neutral",
            border: "",
            colorNotStudied: "bg-neutral",
            studyContainer: "bg-neutral",
            textProgress:"text-white",
            hoverBackground: "sm:hover:bg-gray-800",
        }
    }

    return {
           bgColor: "bg-base-100",
            border: "border",
            colorNotStudied: "bg-base-200",
            studyContainer: "bg-base-200 border",
            textProgress:"text-neutral",
            hoverBackground: "sm:hover:bg-gray-200"
    }
}

const getThemeSaved = ()=>{
    const theme = localStorage.getItem("theme")
    if(theme){
        $("html").get().dataset.theme = theme
    }
    
}


export {theme,getThemeSaved}
