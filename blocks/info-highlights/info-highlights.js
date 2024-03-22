const DEFAULT_COLOR = "red";

export default function decorate(block) {
    // getting color code of block
    let colorCode = getColorCode(block);

    if (colorCode == "no-color") {
        block.classList.add(DEFAULT_COLOR);
        colorCode = DEFAULT_COLOR;
    }

    // check if "contact-us" need to be appended in the block
    if (block.classList.contains("contact-us")) {
        // appending the "contact-us" in the block
        let contactUsParentBlock = block.firstElementChild.firstElementChild;
        contactUsParentBlock.innerHTML += 
                            `<div class="contact-us"> 
                                <a href="/en-us/contact-us">
                                    <span class="` + colorCode + `">CONTACT US</span>
                                </a>
                            </div>`;    
    }
}

function getColorCode(block) {
    if (block.classList.contains("blue")) {
        return "blue-color";
    } else if (block.classList.contains("red")) {
        return "red-color";
    } else if (block.classList.contains("orange")) {
        return "orange-color";
    } else {
        return "no-color";
    }
}
