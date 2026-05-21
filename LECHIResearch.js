const researchForm = document.querySelector("#researchForm");
const researchResult = document.querySelector("#researchResult");
const toastRegion = document.querySelector("#toastRegion");
const researchSubject = document.querySelector("#researchSubject");

function showToast(title, body) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<strong>${title}</strong><p>${body}</p>`;
    toastRegion.appendChild(toast);
    window.setTimeout(() => toast.remove(), 4200);
}

function runResearch() {
    const subject = document.querySelector("#researchSubject").value;
    const relevantJudgements = document.querySelector("#relevantJudgements").value;
    const insuranceSide = document.querySelector("#insuranceSide").value;
    const caseTitle = document.querySelector("#caseTitle").value.trim();
    const judgementGist = document.querySelector("#judgementGist").value.trim();

    researchResult.innerHTML = `
        <span class="eyebrow">BOT research output</span>
        <h3>${subject}</h3>
        <div class="research-finding-grid">
            <div><span>Relevant Judgements</span><strong>${relevantJudgements}</strong></div>
            <div><span>Insurance Result</span><strong>${insuranceSide}</strong></div>
            <div><span>Case Title</span><strong>${caseTitle || "Not specified"}</strong></div>
        </div>
        <p><strong>Gist of Judgement:</strong> ${judgementGist || "No gist entered."}</p>
        <div class="citation-list">
            <p><strong>LECHI Finding:</strong> Based on the subject line, the strongest research angle is evidence quality, policy condition breach, and whether tribunal reasoning supports defence or compromise.</p>
            <p><strong>Suggested Use:</strong> Map this judgement against open claims having similar facts, court, policy condition, and advocate notes.</p>
            <p><strong>Draft Note:</strong> This research should be validated with live legal database citations before final legal submission.</p>
        </div>
    `;

    showToast("Research completed", "LECHI researched the selected subject line and generated a sample judgement summary.");
}

researchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    runResearch();
});

const requestedSubject = new URLSearchParams(window.location.search).get("subject");

if (requestedSubject) {
    const matchingOption = Array.from(researchSubject.options).find((option) => (
        option.value.toLowerCase() === requestedSubject.toLowerCase()
    ));

    if (matchingOption) {
        researchSubject.value = matchingOption.value;
    } else {
        const customOption = new Option(requestedSubject, requestedSubject);
        researchSubject.add(customOption, 0);
        researchSubject.value = requestedSubject;
    }

    runResearch();
}
