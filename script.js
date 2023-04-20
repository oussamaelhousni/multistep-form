let currentStep = 1;
const addOnsPrice = {
    "Online service":{
        year:12,
        month:5
    },
    "Larger storage":{
        year:12,
        month:5
    }
    ,
    "Customizable profile":{
        year:12,
        month:5
    }
}
const steps = [...document.querySelectorAll(".step")];
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");
const confirmBtn = document.getElementById("confirm-btn");
const plans = [...document.querySelectorAll(`[name="plan"]`)];
const sideBarSteps = document.querySelectorAll(".btn-step")

let state = {
    name: "",
    email: "",
    phone: "",
    plan: "",
    monthly: true,
    "add-ons": [],
};

const clearFormErrors = () => {
    document
        .querySelectorAll(".form-error")
        .forEach((element) => (element.innerText = ""));
};

const updateUi = () => {
    const content = document.querySelector(".content");

    if(currentStep == 1){
        backBtn.classList.add("d-none")
        document.querySelector(".hidden-btn").classList.remove("d-none")
    }
    else{
        backBtn.classList.remove("d-none")
        document.querySelector(".hidden-btn").classList.add("d-none")
    }

    if(currentStep == 4){
        nextBtn.classList.add("d-none")
        confirmBtn.classList.remove("d-none")
    }else{
        nextBtn.classList.remove("d-none")
        confirmBtn.classList.add("d-none")
    }

    if(currentStep===5){
        document.querySelector(".btns").classList.add("d-none")
    }
    if(currentStep < 5){
        sideBarSteps.forEach((node,index)=>{
            if(index+1==currentStep){
                node.classList.add("active")
            }else{
                node.classList.remove("active")
            }
        })
    }
    content.style.left = `${-1 * (currentStep - 1) * 100}%`;
};

const showError = (element, text) => {
    element.parentElement.querySelector(".form-error").innerText = text;
};

const getPersonalInformation = () => {
    const emailregEx =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    clearFormErrors();
    if (name.value === "") {
        showError(name, "Name is required");
        throw new Error()
    }

    if (email.value === "") {
        showError(email, "Email is required");
        throw new Error("name is required")
    } else if (!emailregEx.test(email.value)) {
        showError(email, "Invalid email");
        throw new Error()
    }

    if (phone.value === "") {
        showError(phone, "Phone is required");
        throw new Error()
    }

    state = {
        ...state,
        name: name.value,
        email: email.value,
        phone: phone.value,
    };
};

const getPlanInformation = () => {
    const selectedPlan = plans
        .filter((node) => node.checked)
        .reduce((plan, node) => plan + node.dataset.plan, "");
    const monthly = document.getElementById("month-year").checked === false;
    state.plan = selectedPlan;
    state.monthly = monthly;
    console.log(state)
};

const getAddOns = () => {
    const add_ons = [...document.querySelectorAll(`.add-on`)].filter(node=>node.checked).map(node=>node.dataset.name)
    state["add-ons"] = add_ons;
};

const changePlan = () => {
    state.monthly = !state.monthly
};


const createAddOnItemHeader = (planName,planOption,totalPrice)=>{
    document.getElementById("planAndPlanOption").innerHTML = `${planName}(${planOption==="yr"?"Yearly":"Monthly"})`
    document.getElementById("planPrice").innerHTML = `${totalPrice}/${planOption}`
}

const createAddOnItemFooter = (totalPrice,planOption)=>{
    document.getElementById("totalPrice").innerHTML = `${totalPrice}/${planOption}`
}
const createAddOnItem = (addOnName,planOption,price)=>{
    return `
        <li>
            <span class="color-gray"
                >${addOnName}</span
            >
            <span class="color-maring-blue"
                >+$${price}/${planOption}</span
            >
        </li>
    `
}
const constructFinishingUpStep = ()=>{
    let totalPrice = state.monthly === true ? 9 : 90
    const planOption = state.monthly === false ?"yr":"mo"
    let finalCheckItems = state["add-ons"].map(add_on=>{
        let add_on_price = state.monthly === false ? addOnsPrice[add_on]["year"]:addOnsPrice[add_on]["month"]
        totalPrice += add_on_price
        return createAddOnItem(add_on,planOption,add_on_price)
    })

    // deleting existing addons from final-check ul
    const existingAddOns = [...document.querySelector(".final-check").children]
    existingAddOns.forEach((node,index)=>{
        if(index==0) return
        document.querySelector(".final-check").removeChild(node)
    })
    
    // add the finalcheckitems to finalcheck ul
    document.querySelector(".final-check").insertAdjacentHTML("beforeend",finalCheckItems.join(""))
    createAddOnItemHeader(state.plan,planOption,state.monthly === true ? 9 : 90)
    createAddOnItemFooter(totalPrice,planOption)
}

nextBtn.addEventListener("click", () => {
    switch (currentStep) {
        case 1:
            try {
                getPersonalInformation();
            } catch (e) {
                return;
            }
            break;
        case 2:
            getPlanInformation();
            break;
        case 3:
            getAddOns();
            constructFinishingUpStep()
            break;
        case 4:
            console.log("wtd")
            //changePlan();
            break;
    }
    currentStep++;
    updateUi();
    console.log(currentStep);
});

backBtn.addEventListener("click", () => {
    if(currentStep < 2) return
    currentStep--;
    updateUi();
});

confirmBtn.addEventListener("click", () => {
    currentStep=5
    updateUi();
})
