const { GoogleGenerativeAI } = require("@google/generative-ai");

API_KEY = 'YOUR API KEY'

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
Chaque ensemble est noté entre 0 et 10 en partant de la permière compétence de l'ensemble. Par exemple, 7 en flexibilité correspond à 3 en fermeté. Pour un souci de clarté, on applique cette regle.


The idea would be for you to give me the scores for each category based on a job decription.
Remember, you can't classify a category between 4-6 ! you need to be more selective. For example, Novelty seeking can not be leaning toward 5, it's either 0, 1 ,2, 3 or 7, 8 or 9

Once you are given a job description, output the result in a format like this :


{
  "personality_traits": [
    {
      "category": "Persuasiveness",
      "leaning": 3
    },
    {
      "category": "Flexibility",
      "leaning": 9
    },
    {
      "category": "Extraversion",
      "leaning": 3
    },
    {
      "category": "Emotional distance",
      "leaning": 7
    },
    {
      "category": "Improvisation",
      "leaning": 7
    },
    {
      "category": "Rationalism",
      "leaning": 9
    },
    {
      "category": "Respect for rules",
      "leaning": 5
    },
    {
      "category": "Work involvement",
      "leaning": 7
    },
    {
      "category": "Desire for power",
      "leaning": 0
    },
    {
      "category": "Need for action",
      "leaning": 5
    },
    {
      "category": "Ambition",
      "leaning": 7
    },
    {
      "category": "Modesty",
      "leaning": 3
    },
    {
      "category": "Need for autonomy",
      "leaning": 7
    },
    {
      "category": "Sense of community",
      "leaning": 5
    },
    {
      "category": "Altruism",
      "leaning": 0
    },
    {
      "category": "Individualism",
      "leaning": 0
    },
    {
      "category": "Novelty seeking",
      "leaning": 7
    },
    {
      "category": "Familiarity seeking",
      "leaning": 3
    }
  ]
}

Once again, make sure to lean the scores towards the dominant side, so it offers a clearer understanding of the desired personality profile for the role.

If the description given doesn't seem to be a job offer, return {"error" : "The text provided doen't seem to be a job offer"}.

Here is the job offer :`

let prompt_job_offer = `
Description du poste
QUI SOMMES-NOUS ?

Thales propose des systèmes d’information et de communication sécurisés et interopérables pour les forces armées, les forces de sécurité et les opérateurs d’importance vitale. Ces activités, qui regroupent radiocommunications, réseaux, systèmes de protection, systèmes d’information critiques et cybersécurité, répondent aux besoins de marchés où l’utilisation des nouvelles technologies numériques est déterminante. Thales intervient tout au long de la chaîne de valeur, des équipements aux systèmes en passant par le soutien logistique et les services associés.
Nos équipes de l’activité Systèmes d’information critiques et cybersécurité fournissent des services et des solutions globales optimisant la performance, la résilience et la sécurité des systèmes d’information afin de faire face aux ruptures technologiques et aux cybermenaces.
QUI ETES VOUS ?

Vous êtes diplômé d'un BAC+3 et vous visez un poste d'ingénieur(e) en développement logiciel ?

Vous vous intéressez au développement web de façon générale et connaissez une ou plusieurs technologies parmi C#, .Net, Javascript, Angular, HTML 5, CSS 3 ?
Vous souhaitez vous familiariser avec les processus de développement industriels (DevSecOps) ?
Vous êtes à l'aise en anglais ?
Vous avez le goût du travail en équipe ?
Vous vous reconnaissez ? Alors vous avez de bonnes chances de vous épanouir dans nos équipes !

CE QUE NOUS POUVONS ACCOMPLIR ENSEMBLE :

Thales propose des systèmes d’information et de communication sécurisés et interopérables pour les forces armées, les forces de sécurité et les opérateurs d’importance vitale.

Ces activités, qui regroupent radiocommunications, réseaux, systèmes de protection, systèmes d’information critiques et cybersécurité, répondent aux besoins de marchés où l’utilisation des nouvelles technologies numériques est déterminante.

Thales intervient tout au long de la chaîne de valeur, des équipements aux systèmes en passant par le soutien logistique et les services associés.

Nos équipes de l’activité Systèmes d’information critiques et cybersécurité fournissent des services et des solutions globales optimisant la performance, la résilience et la sécurité des systèmes d’information afin de faire face aux ruptures technologiques et aux cybermenaces.

En nous rejoignant, vos principales missions seront les suivantes :

Le centre de compétences de Lambersart recherche un.e alternant.e pour intervenir au sein d'une équipe de développement dynamique (équipes de 3 à 6 personnes).

Vous participerez au développement d'applications dans un environnement bienveillant avec un encadrement motivé.

En nous rejoignant, vous vous verrez confier les missions suivantes :

Sur les phases amont, spécifier et affiner le besoin avec le Product Owner via d’éventuelles interviews utilisateurs ou autres ateliers ;
Participer à toutes les cérémonies AGILE ;
Analyser, concevoir et développer l’applicatif en collaboration avec l’équipe constituée d’architectes logiciels, d’ergonome, de développeurs et de chef de projet ;
Mettre en place les tests unitaires et fonctionnels afin d’assurer les qualités des développements ;
Rédiger la documentation associée ;
Participer à la mise en production de l’application ;
Contribuer à l’amélioration de l’équipe
Cette alternance sera l’opportunité pour vous de travailler en équipe au sein d’une entreprise innovante, de valoriser les acquis académiques en environnement industriel et développer de nouvelles compétences.

Innovation, passion, ambition : rejoignez Thales et créez le monde de demain, dès aujourd’hui.
`


// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


  const result = await model.generateContent(prompt_intro + prompt_job_offer);
  const response = await result.response;
  let text = response.text();
  text = text.replace('\`\`\`json', '')
  text = text.replace('\`\`\`', '')

  console.log(JSON.parse(text));
}

run();