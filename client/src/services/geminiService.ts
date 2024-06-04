import { useUserStore } from "@/stores/userStore";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Service used to communicate with gemini.
 */
export class GeminiService {

    /**
     * Method used to call the gemini api to get the job offer analysis.
     * @param jobOfferDescription Description of the job offer we want to analyze.
     * @returns 
     */
    public static async callGeminiAsync(jobOfferDescription : string) {

        let prompt_intro = `Voici des définitions de catégories de profil :

        La « volonté de persuasion» est définie comme l'aisance avec laquelle un individu arrive à
        convaincre et à influencer les autres en utilisant le tact et en adaptant son discours à son auditoire.
        Le «besoin d'objectivité» renvoie à la tendance à faire preuve d'authenticité et de transparence dans
        sa façon de communiquer.

        La «flexibilité» est définie comme la propension d'un individu à considérer les points de vue d'autrui
        et de rechercher le consensus et ce, afin d'éviter les conflits.
        La «fermeté» renvoie à la tendance à affirmer son point de vue avec détermination et à maintenir
        rigoureusement ses positions dans ses échanges avec les autres.

        L' «extraversion» est définie comme la tendance à être ouvert, plein d'entrain et à chercher à
        développer de nombreux contacts amicaux.
        L' «introversion» renvoie à la tendance à être réservé et formel, préférant s'investir dans des
        relations peu nombreuses mais proches.

        La «distance émotionnelle» est définie comme la tendance à rester calme, détaché et à garder son
        sang-froid, même dans les situations stressantes ou déconcertantes.
        La «sensibilité émotionnelle» est la tendance à prendre les choses à cœur, à exprimer facilement
        son ressenti et à être réactif à la pression et au stress.

        L' «improvisation» est définie comme le fait d'être spontané, d'avancer sans avoir besoin de plan
        précis et d'être à l'aise pour gérer les imprévus.
        L' «organisation» renvoie à la préférence à organiser ses activités de façon méthodique et à recourir
        à des procédures claires pour mener ses actions.

        La dimension «rationalisme» correspond à la tendance à être objectif, logique, analytique et centré
        sur les faits lors de l'évaluation des informations et de la prise de décisions
        L’«intuition» renvoie à la tendance à appréhender les situations de façon globale et à faire des choix
        en se référant à son ressenti, son instinct, ses impressions, ses expériences.

        Le «respect des règles» est la tendance à adhérer et à faire avec les directives et les standards
        établis par la société
        La «libre pensée» représente la propension à poser un regard critique sur les règles établies, de
        façon à les modifier ou à en créer de nouvelles si elles sont perçues comme désuètes ou inefficaces.

        L' «implication au travail» renvoie à la forte importance que l'on accorde au travail et au lien
        émotionnel que l'on noue avec son entreprise.
        L' «équilibre personnel» quant à lui renvoie à une volonté de séparer vie privée et vie
        professionnelle, trouvant un équilibre entre les deux

        La «volonté de pouvoir» est définie comme la tendance à prendre en charge les situations et à
        rechercher des rôles qui requièrent de prendre des décisions et de diriger les autres.
        Le «besoin d'encadrement» quant à lui renvoie à une préférence à être supervisé, guidé, à recevoir
        des directives claires et à rechercher des feedback sur son travail.

        Le «besoin d'action» renvoie à la tendance à être dynamique et à préférer les projets à court-terme
        qui permettent d'obtenir des résultats concrets et immédiats.
        Le «besoin de réflexion» renvoie à la préférence à s'investir dans des projets à long terme qui
        requièrent de la stratégie, de la patience et de la réflexion.

        L' «ambition» est définie comme la recherche de réussite en se fixant des objectifs risqués et
        ambitieux.
        La «modestie» renvoie à la tendance à être satisfait de sa situation et à apprécier la stabilité
        professionnelle.

        Le «besoin d'autonomie» est défini comme la préférence pour la liberté et l'indépendance dans
        l'exécution de son travail
        Le «sens du groupe» renvoie à une tendance vers la coopération et la solidarité et à une préférence
        à effectuer les tâches en groupe.

        L' «altruisme» est défini comme la tendance à se préoccuper des autres, à donner de son temps et
        de son énergie dans le but de contribuer à l'intérêt général.
        L' «individualisme» renvoie au fait d'être pragmatique, centré sur ses propres objectifs.

        La «recherche de nouveauté» est définie comme le fait d'être curieux et enclin à explorer, tester ou
        définir de nouvelles façons de faire.
        La «recherche de familiarité» renvoie au fait d'être plus à l'aise avec ses habitudes, d'avoir ses
        repères établis et de suivre les méthodes éprouvées

        Chacune décrit un aspect et son opposé. 
        Chaque ensemble est noté entre 1 et 9 en partant de la permière compétence de l'ensemble. Par exemple, 7 en flexibilité correspond à 3 en fermeté. Pour un souci de clarté, on applique cette regle.


        The idea would be for you to give me the scores for each category based on a job decription.
        Remember, you can't classify a category between 4-6 ! you need to be more selective. For example, Novelty seeking can not be leaning toward 5, it's either 0, 1 ,2, 3 or 7, 8 or 9

        Once you are given a job description, analyze the job offer and attribute a score to each factor :


        {
        "Persuasiveness": ...,
        "Flexibility": ...,
        "Extraversion": ...,
        "Emotional distance": ...,
        "Improvisation": ...,
        "Rationalism": ...,
        "Respect for rules": ...,
        "Work involvement": ...,
        "Desire for power": ...,
        "Need for action": ...,
        "Ambition": ...,
        "Need for autonomy": ...,
        "Altruism": ...,
        "Novelty seeking": ...,
        }

        You can see that none of the scores are between 4 and 6.
        Once again, make sure to lean the scores towards the dominant side, so it offers a clearer understanding of the desired personality profile for the role.

        If the description given doesn't seem to be a job offer, return {"error" : "The text provided doen't seem to be a job offer"}.

        Here is the job offer :`

        
        let user_factors = `
            Based on the following factors scores, add a "comment" property to the json to be outputed with a little text explaining if the user profile match tje job offer factors or not based on the provided profile.
            Write it as if you were talking to them directly.
            Also add a "note" property to the json to be outputed reflecting fit score of the user profile to the job offer, based on the provided scores and the score you found previously. The note is equal to the number of identical score (for example if user has Persuasiveness = 1 and you analyzed that the job also requires a 1, it is +1. Else it is +0 to the note.).
            Based on the job description, add a "company" property with the detected company name if it exists else let it empty.
            Based on the job description, add a "job_title" property with the detected job_title if you find it else empty.
            Here are the scores : ${JSON.stringify(useUserStore().user.factors)}
            
            
            at the end, you should have a json this format to be outputed :
            
            {
                "Persuasiveness": ...,
                "Flexibility": ...,
                "Extraversion": ...,
                "Emotional distance": ...,
                "Improvisation": ...,
                "Rationalism": ...,
                "Respect for rules": ...,
                "Work involvement": ...,
                "Desire for power": ...,
                "Need for action": ...,
                "Ambition": ...,
                "Need for autonomy": ...,
                "Altruism": ...,
                "Novelty seeking": ...,
                "comment": comment ...?
                "note" : 6,
                "company" : ...,
                "job_title" : ...
                }
            `

        // Access your API key as an environment variable (see "Set up your API key" above)
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_APP_API_KEY ?? '');

        // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

        const result = await model.generateContent(prompt_intro + jobOfferDescription + user_factors);
        const response = await result.response;
        let text = response.text();
        text = text.replace('\`\`\`json', '')
        text = text.replace('\`\`\`', '')

        console.log(JSON.parse(text));
        return JSON.parse(text)
    }
}