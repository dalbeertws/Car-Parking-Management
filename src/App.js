import React, { useEffect, useRef, useState } from "react";
import MyRoutes from "./MyRoutes";
import { ToastContainer } from "react-toastify";
import dutch from './Assets/Images/dutch.svg'
import english from './Assets/Images/english.svg'
import AlertMessage from "Components/AlertMessage";

const App = () => {
const googleTranslateElementRef = useRef(null);
const [tab,settab]=useState({
   tab1:false,
   tab2:false,
})

useEffect(() => {
    function loadGoogleTranslateScript() {
     if (!window?.google && !window?.google?.translate) {
        const newScript = document.createElement("script");
        newScript.src = "//translate.google.com/translate_a/element.js";
        newScript.id = "googleTranslateScript";
        newScript.async = true;

        newScript.onload = () => {

         new window.google.translate.TranslateElement(
            {
             pageLanguage: "en",
             includedLanguages: "en,nl,it",
             excludedClasses: "notranslate",
             autoDisplay: false,
            },
            googleTranslateElementRef.current
         );
        };

        newScript.onerror = (error) => {
         console.error("Error loading Google Translate script:", error);
        };

        document.body.appendChild(newScript);
     } else {
      try{
         new window.google.translate.TranslateElement(
            {
               pageLanguage: "en",
               includedLanguages: "en,nl,it",
               excludedClasses: "notranslate",
               autoDisplay: false,
               detectLanguage: false,
               defaultLanguage: 'en'
            },
            googleTranslateElementRef.current
           );
      }
      catch(e){
      }
     }
    }

    loadGoogleTranslateScript();

    const handleVisibilityChange = () => {
     if (document.visibilityState === 'visible') {
        loadGoogleTranslateScript();
     }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
     document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
}, []);

const handleToChangeLanguage = (languageCode) => {
   if((languageCode==='nl' && tab.tab1===false) || (languageCode==='en' && tab.tab2===false)){
    const selectElement = document.querySelector('.goog-te-combo');

    if (selectElement) {
     selectElement.value = languageCode;
     const event = new Event('change', { bubbles: true });
     selectElement.dispatchEvent(event);

     selectElement.dispatchEvent(event);
     selectElement.dispatchEvent(event);
    }
   }
};

return (
    <>
     <div ref={googleTranslateElementRef} style={{ textAlign: 'end' }}></div>
     <div className="language-changer notranslate">
        <button className="lang-button" onClick={() => { handleToChangeLanguage('nl');
      settab({tab1:true,tab2:false})
      }}>
         <img src={dutch} alt="" style={{ width: '17px', height: '17px' }} />NL
        </button>
        <button className="lang-button" onClick={() => { handleToChangeLanguage('en');
      settab({tab2:true,tab1:false}) }}>
         <img src={english} alt="" style={{ width: '17px', height: '17px' }} />EN
        </button>
     </div>
     <AlertMessage />
     <ToastContainer />
     <MyRoutes />
    </>
);
};

export default App;
