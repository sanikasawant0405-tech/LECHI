const chatWindow = document.querySelector("#chatWindow");
const commandForm = document.querySelector("#commandForm");
const commandInput = document.querySelector("#commandInput");
const dashboardPanel = document.querySelector("#dashboardPanel");
const whatsappWorkflow = document.querySelector("#whatsappWorkflow");
const researchPanel = document.querySelector("#researchPanel");
const researchForm = document.querySelector("#researchForm");
const researchResult = document.querySelector("#researchResult");
const toastRegion = document.querySelector("#toastRegion");

let waitingForAdvocateAlert = false;

const claimDatabase = {
    "CLM-24-7812": {
        claimNumber: "CLM-24-7812",
        status: "Pending legal opinion before Pune MACT",
        insuredName: "Ramesh Patil",
        court: "Pune MACT",
        nextHearing: "24 May 2026",
        advocate: "Adv. Meera Rao",
        claimAmount: "Rs. 18.4L",
        triggeredDefence: "Driving License violation",
        defenceKeyword: "Driving License",
        defenceSubject: "Fake driving licence defence",
        summary: "RTO verification is pending and licence validity is disputed. Recovery-right research is recommended before final compromise call."
    },
    "CLM-24-5520": {
        claimNumber: "CLM-24-5520",
        status: "Open for compromise review",
        insuredName: "Amit Shah",
        court: "Mumbai MACT",
        nextHearing: "28 May 2026",
        advocate: "Adv. Iqbal Khan",
        claimAmount: "Rs. 11.8L",
        triggeredDefence: "Quantum dispute",
        defenceKeyword: "Quantum",
        defenceSubject: "Quantum challenge in MACT",
        summary: "Medical evidence and disability certificate need comparison with recent MACT award trends."
    }
};

const compromiseSummary = {
    total: 76,
    highFit: 32,
    mediumFit: 28,
    reviewFirst: 16,
    settlementAmount: "Rs. 8.72 Cr",
    advocates: 18
};

function addMessage(type, text, actions = []) {
    const message = document.createElement("div");
    message.className = `message ${type}`;

    const actionMarkup = actions.length
        ? `<div class="message-actions">${actions.map((action) => `<button type="button" data-command="${action.command}">${action.label}</button>`).join("")}</div>`
        : "";

    message.innerHTML = `
        <strong>${type === "user" ? "Claim Legal User" : "LECHI"}</strong>
        <p>${text}</p>
        ${actionMarkup}
    `;

    chatWindow.appendChild(message);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showDashboard() {
    dashboardPanel.classList.remove("is-hidden");
    dashboardPanel.classList.remove("is-rendered");
    window.requestAnimationFrame(() => dashboardPanel.classList.add("is-rendered"));
    dashboardPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showWhatsAppWorkflow() {
    whatsappWorkflow.classList.remove("is-hidden");
    whatsappWorkflow.classList.remove("is-rendered");
    window.requestAnimationFrame(() => whatsappWorkflow.classList.add("is-rendered"));
    whatsappWorkflow.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showResearchPanel() {
    window.open("./LECHIResearch.html", "_blank", "noopener");
}

function getResearchUrl(subject) {
    return `./LECHIResearch.html?subject=${encodeURIComponent(subject)}`;
}

function createDefenceResearchLink(claim) {
    return `<a href="${getResearchUrl(claim.defenceSubject)}" target="_blank" rel="noopener">${claim.defenceKeyword}</a>`;
}

function showToast(title, body) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<strong>${title}</strong><p>${body}</p>`;
    toastRegion.appendChild(toast);
    window.setTimeout(() => toast.remove(), 4200);
}

function answerDashboard() {
    showDashboard();
    addMessage(
        "bot",
        "Here is your dashboard today. Cases on board: 126. Compromisable cases: 76. Estimated settlement amount: Rs. 8.72 Cr. Advocate alerts pending: 18. I have also rendered court-wise analytics below."
    );
}

function answerCompromiseBucket() {
    waitingForAdvocateAlert = true;
    addMessage(
        "bot",
        `You have ${compromiseSummary.total} compromise cases in your bucket. ${compromiseSummary.highFit} are high-fit, ${compromiseSummary.mediumFit} are medium-fit, and ${compromiseSummary.reviewFirst} need review first. Estimated settlement reserve is ${compromiseSummary.settlementAmount}. ${compromiseSummary.advocates} advocates are involved. Would you like to initiate advocate alerts?`,
        [
            { label: "YES", command: "YES initiate advocate alerts" },
            { label: "NO", command: "NO keep as draft" }
        ]
    );
}

function initiateAdvocateAlerts() {
    waitingForAdvocateAlert = false;
    showWhatsAppWorkflow();
    addMessage(
        "bot",
        "Opening WhatsApp Business workflow. Advocate-wise compromise alerts are prepared and sent to Adv. Meera Rao, Adv. Iqbal Khan, and Adv. Priya Nair in this demo."
    );
    showToast("WhatsApp Business workflow", "Simulated advocate-wise compromise alerts were sent successfully.");
}

function answerResearchOpen() {
    showResearchPanel();
    addMessage(
        "bot",
        "I have opened the Research tab. Please select Subject, Relevant Judgements, Insurance side, Case title, and Gist of the Judgement. After you submit, I will research on the subject line and prepare a legal summary."
    );
}

function runResearch() {
    const subject = document.querySelector("#researchSubject").value;
    const relevantJudgements = document.querySelector("#relevantJudgements").value;
    const insuranceSide = document.querySelector("#insuranceSide").value;
    const caseTitle = document.querySelector("#caseTitle").value.trim();
    const judgementGist = document.querySelector("#judgementGist").value.trim();

    researchResult.innerHTML = `
        <span class="eyebrow">AI research output</span>
        <h3>${subject}</h3>
        <div class="research-finding-grid">
            <div><span>Judgement scope</span><strong>${relevantJudgements}</strong></div>
            <div><span>Insurance view</span><strong>${insuranceSide}</strong></div>
            <div><span>Case title</span><strong>${caseTitle || "Not specified"}</strong></div>
        </div>
        <p><strong>Gist:</strong> ${judgementGist || "No gist entered."}</p>
        <div class="citation-list">
            <p><strong>Finding 1:</strong> LECHI found sample precedent patterns supporting evidence-led defence, policy breach analysis, and recovery-right positioning.</p>
            <p><strong>Finding 2:</strong> Recommended use: compare RTO verification, insured knowledge, witness evidence, and tribunal observations before deciding defence or compromise.</p>
            <p><strong>Draft legal note:</strong> This matter should be tagged for ${insuranceSide.toLowerCase()} research review with verified citations from the legal database integration.</p>
        </div>
    `;

    addMessage(
        "bot",
        `Research completed on "${subject}". I found ${relevantJudgements.toLowerCase()} with a ${insuranceSide.toLowerCase()} lens and prepared the research summary in the Research tab.`
    );
    showToast("Research completed", "LECHI generated a sample legal research summary from the selected fields.");
}

function getLechiReply(command) {
    const lowerCommand = command.toLowerCase();
    const claimKeyword = command.match(/@([A-Za-z0-9-]+)/)?.[1]?.toUpperCase();

    if (claimKeyword) {
        const claim = claimDatabase[claimKeyword];

        if (!claim) {
            return `I searched for claim number ${claimKeyword}, but no matching sample record is available in the current JS demo data.`;
        }

        const defenceLink = createDefenceResearchLink(claim);

        return `Claim ${claim.claimNumber} is currently "${claim.status}". Insured: ${claim.insuredName}. Court: ${claim.court}. Next hearing: ${claim.nextHearing}. Advocate: ${claim.advocate}. Claim amount: ${claim.claimAmount}. Triggered defence found: ${claim.triggeredDefence}. Click ${defenceLink} to open relevant judgement research. ${claim.summary}`;
    }

    if (waitingForAdvocateAlert && /^(yes|y|ok|okay|send|please|yes initiate)/i.test(lowerCommand)) {
        initiateAdvocateAlerts();
        return null;
    }

    if (waitingForAdvocateAlert && /^(no|n|later|no keep)/i.test(lowerCommand)) {
        waitingForAdvocateAlert = false;
        return "Okay. I have saved the advocate alert workflow as a draft for legal manager review.";
    }

    if (lowerCommand.includes("what is my dashboard today") || lowerCommand.includes("dashboard")) {
        answerDashboard();
        return null;
    }

    if (lowerCommand.includes("compromise cases") || lowerCommand.includes("compromisable") || lowerCommand.includes("compromise bucket")) {
        answerCompromiseBucket();
        return null;
    }

    if (lowerCommand.includes("court-wise") || lowerCommand.includes("court wise") || lowerCommand.includes("court analytics")) {
        showDashboard();
        return "Court-wise analytics are rendered below. Mumbai MACT has 54 open cases, Pune MACT has 44, Nashik MACT has 29, Nagpur MACT has 23, and Ahmedabad has 19.";
    }

    if (lowerCommand.includes("advocate alert") || lowerCommand.includes("whatsapp")) {
        waitingForAdvocateAlert = true;
        return "I can initiate WhatsApp Business alerts for 18 panel advocates across 76 compromise-fit matters. Would you like to initiate advocate alerts?";
    }

    if (lowerCommand.includes("research") || lowerCommand.includes("judgement") || lowerCommand.includes("judgment")) {
        answerResearchOpen();
        return null;
    }

    if (lowerCommand.includes("weather") || lowerCommand.includes("traffic")) {
        return "Weather and traffic widgets are visible on the right. Mumbai Legal Hub is 31 C with moderate court-route traffic and an estimated 42 minute travel time.";
    }

    return "I can help with today's dashboard, compromise bucket, court-wise analytics, settlement reserve, weather and traffic context, and WhatsApp Business advocate alerts.";
}

commandForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const command = commandInput.value.trim();

    if (!command) {
        return;
    }

    addMessage("user", command);
    const reply = getLechiReply(command);

    if (reply) {
        addMessage("bot", reply);
    }

    commandInput.value = "";
});

document.addEventListener("click", (event) => {
    const researchButton = event.target.closest("[data-open-research]");

    if (researchButton) {
        event.preventDefault();
        showResearchPanel();
        addMessage("bot", "I have opened the Research tab. Please fill Subject, Relevant Judgements, Insurance side, Case title, and Gist of the Judgement. After submission, I will research on the subject line.");
        return;
    }

    const button = event.target.closest("[data-command]");

    if (!button) {
        return;
    }

    event.preventDefault();
    commandInput.value = button.dataset.command;
    commandForm.requestSubmit();
});

if (researchForm) {
    researchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        runResearch();
    });
}
