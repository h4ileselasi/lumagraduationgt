// main.js - Complete Fixed Version

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Luma Studios Website Initializing...");

  // Initialize all components
  initNavbar();
  initStatsCounter();
  initPackageSelection();
  initContactForm();
  initHorizontalScroll();
  initPaymentSystem(); // Added payment system initialization

  console.log("Luma Studios Website Initialized Successfully!");
});

// ========== NAVBAR ==========
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-links a");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    // Close menu when clicking on links
    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// ========== STATS COUNTER ==========
function initStatsCounter() {
  const counters = document.querySelectorAll(".stat-number");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));

  function animateCounter(counter) {
    const target = parseInt(counter.getAttribute("data-count"));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current);
    }, 16);
  }
}

// ========== PACKAGE SELECTION ==========
function initPackageSelection() {
  const packageButtons = document.querySelectorAll(".pricing-card .btn");
  const packageInput = document.getElementById("package");
  const contactForm = document.querySelector(".contact-form");

  packageButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const packageName = this.getAttribute("data-package");

      if (packageInput) {
        packageInput.value = packageName + " Package";

        // Visual feedback
        packageInput.style.borderColor = "#10b981";
        packageInput.style.backgroundColor = "#f0f9ff";
        setTimeout(() => {
          packageInput.style.borderColor = "";
          packageInput.style.backgroundColor = "";
        }, 2000);
      }

      // Scroll to the CONTACT FORM, not just the section
      if (contactForm) {
        // First scroll to the contact section
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }

        // Then after a small delay, ensure the form is visible
        setTimeout(() => {
          contactForm.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 500);
      }
    });
  });
}

// ========== CONTACT FORM ==========
function initContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (!contactForm) {
    console.log("Contact form not found");
    return;
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const whatsappNumber = document.getElementById("whatsapp").value;
    const package = document.getElementById("package").value || "Not Selected";
    const message = document.getElementById("message").value;

    // Package prices mapping
    const packagePrices = {
      "Bronze Package": 250,
      "Silver Package": 350,
      "Gold Package": 450,
      "Platinum Package": 550,
      "Family Package": 700,
    };

    // Calculate 50% deposit
    const packagePrice = packagePrices[package] || 0;
    const depositAmount = packagePrice * 0.5;

    // Create the WhatsApp message with payment instructions
    const whatsappMessage = `
📸 *LUMA STUDIO PHOTOGRAPHY BOOKING*

*Client Details:*
👤 Name: ${name}
📧 Email: ${email}
📱 WhatsApp: ${whatsappNumber}
📦 Selected Package: ${package}
💰 Package Price: GH₵ ${packagePrice}
💳 50% Deposit Required: GH₵ ${depositAmount}

*Client's Message:*
${message}

---

💳 *PAYMENT INSTRUCTIONS:*
Please make 50% installment payment of the selected package.

📱 *Mobile Money Details:*
Number: 0595048812
Name: Kelvin Darko

📸 *Please send payment screenshot for confirmation*

---

_Received from Luma Studios Website_
        `.trim();

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/233595048812?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");

    // Show success message
    alert(
      "Thank you! Opening WhatsApp to send your booking details and payment instructions..."
    );

    // Reset form after a delay
    setTimeout(() => {
      contactForm.reset();
    }, 1000);
  });
}

// ========== HORIZONTAL SCROLL ==========
function initHorizontalScroll() {
  const scrollContainers = [
    ".portfolio-scroll",
    ".services-scroll",
    ".tips-scroll",
    ".pricing-scroll",
  ];

  scrollContainers.forEach((selector) => {
    const containers = document.querySelectorAll(selector);
    containers.forEach((container) => {
      setupMouseDragging(container);
    });
  });

  function setupMouseDragging(container) {
    let isDragging = false;
    let startX;
    let scrollLeft;

    const startDrag = (e) => {
      isDragging = true;
      container.style.cursor = "grabbing";
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const stopDrag = () => {
      isDragging = false;
      container.style.cursor = "grab";
    };

    const doDrag = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    // Mouse events
    container.addEventListener("mousedown", startDrag);
    container.addEventListener("mouseleave", stopDrag);
    container.addEventListener("mouseup", stopDrag);
    container.addEventListener("mousemove", doDrag);
  }
}

// ========== PAYMENT SYSTEM ==========
function initPaymentSystem() {
  console.log("Initializing Payment System...");

  // Payment system variables
  let selectedPackage = null;
  let selectedAddons = [];
  let totalAmount = 0;
  let referenceCode = "LUMA-" + Math.floor(1000 + Math.random() * 9000);
  let uploadedFile = null;

  // Initialize the payment system
  updateDisplay();

  // Setup drag and drop for receipt upload
  const uploadArea = document.getElementById("uploadArea");
  const fileInput = document.getElementById("receiptUpload");

  if (uploadArea && fileInput) {
    uploadArea.addEventListener("dragover", function (e) {
      e.preventDefault();
      uploadArea.classList.add("dragover");
    });

    uploadArea.addEventListener("dragleave", function () {
      uploadArea.classList.remove("dragover");
    });

    uploadArea.addEventListener("drop", function (e) {
      e.preventDefault();
      uploadArea.classList.remove("dragover");
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect({ target: { files: files } });
      }
    });

    // Form validation
    const inputs = ["customerName", "customerEmail", "customerPhone"];
    inputs.forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener("input", validateForm);
      }
    });
  }

  // Package selection function - FIXED VERSION
  function selectPackage(button, packageName, price) {
    console.log("Selecting package:", packageName, price);

    // Remove selected class from all packages
    document.querySelectorAll(".package-card-adv").forEach((card) => {
      card.classList.remove("selected");
    });

    // Add selected class to clicked package
    const packageCard = button.closest(".package-card-adv");
    if (packageCard) {
      packageCard.classList.add("selected");

      // Update selected package
      selectedPackage = {
        name: packageName,
        price: price,
        displayName: packageCard.querySelector("h4").textContent,
      };

      calculateTotal();
      updateDisplay();

      console.log("Package selected:", selectedPackage);
    }
  }

  // Make selectPackage function globally available
  window.selectPackage = selectPackage;

  function toggleAddon(addonName, price, isSelected) {
    if (isSelected) {
      selectedAddons.push({ name: addonName, price: price });
    } else {
      selectedAddons = selectedAddons.filter(
        (addon) => addon.name !== addonName
      );
    }

    calculateTotal();
    updateDisplay();
  }

  // Make toggleAddon function globally available
  window.toggleAddon = toggleAddon;

  function calculateTotal() {
    totalAmount = selectedPackage ? selectedPackage.price : 0;
    selectedAddons.forEach((addon) => {
      totalAmount += addon.price;
    });
  }

  function updateDisplay() {
    // Update amount displays
    const amountElements = ["displayAmount", "stepAmount"];
    amountElements.forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.textContent = `GH₵ ${totalAmount}`;
    });

    // Update reference code display
    const displayReference = document.getElementById("displayReference");
    if (displayReference) {
      displayReference.textContent = referenceCode;
    }
  }

  function updateReferenceCode() {
    referenceCode = "LUMA-" + Math.floor(1000 + Math.random() * 9000);
    updateDisplay();
  }

  // Make navigation functions globally available
  window.nextStep = function (step) {
    if (step === 2 && !selectedPackage) {
      alert("Please select a package first.");
      return;
    }

    if (step === 3 && totalAmount === 0) {
      alert("Please select a package before proceeding.");
      return;
    }

    document.querySelectorAll(".step-content").forEach((content) => {
      content.classList.remove("active");
    });

    const nextStepElement = document.getElementById("step" + step);
    if (nextStepElement) {
      nextStepElement.classList.add("active");
    }

    document.querySelectorAll(".step").forEach((stepEl) => {
      stepEl.classList.remove("active");
    });

    const currentStep = document.querySelector(`.step[data-step="${step}"]`);
    if (currentStep) {
      currentStep.classList.add("active");
    }

    updateProgress();
  };

  window.prevStep = function (step) {
    document.querySelectorAll(".step-content").forEach((content) => {
      content.classList.remove("active");
    });

    const prevStepElement = document.getElementById("step" + step);
    if (prevStepElement) {
      prevStepElement.classList.add("active");
    }

    document.querySelectorAll(".step").forEach((stepEl) => {
      stepEl.classList.remove("active");
    });

    const currentStep = document.querySelector(`.step[data-step="${step}"]`);
    if (currentStep) {
      currentStep.classList.add("active");
    }

    updateProgress();
  };

  function updateProgress() {
    // Progress bar animation can be added here
    console.log("Progress updated");
  }

  // Make copy function globally available
  window.copyToClipboard = function (text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Show success feedback
        const btn = event.target.closest("button");
        if (btn) {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i>';
          btn.style.background = "#10b981";
          btn.style.color = "white";

          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = "";
            btn.style.color = "";
          }, 2000);
        }
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        uploadedFile = file;

        const reader = new FileReader();
        reader.onload = function (e) {
          const previewImg = document.getElementById("previewImg");
          const fileName = document.getElementById("fileName");
          const fileSize = document.getElementById("fileSize");
          const uploadArea = document.getElementById("uploadArea");
          const uploadPreview = document.getElementById("uploadPreview");

          if (previewImg) previewImg.src = e.target.result;
          if (fileName) fileName.textContent = file.name;
          if (fileSize)
            fileSize.textContent = (file.size / 1024 / 1024).toFixed(2) + " MB";
          if (uploadArea) uploadArea.style.display = "none";
          if (uploadPreview) uploadPreview.style.display = "block";
        };
        reader.readAsDataURL(file);

        validateForm();
      } else {
        alert("Please upload an image file (JPEG, PNG, etc.)");
      }
    }
  }

  // Make handleFileSelect globally available
  window.handleFileSelect = handleFileSelect;

  window.removeImage = function () {
    uploadedFile = null;
    const uploadArea = document.getElementById("uploadArea");
    const uploadPreview = document.getElementById("uploadPreview");
    const receiptUpload = document.getElementById("receiptUpload");

    if (uploadArea) uploadArea.style.display = "block";
    if (uploadPreview) uploadPreview.style.display = "none";
    if (receiptUpload) receiptUpload.value = "";

    validateForm();
  };

  function validateForm() {
    const name = document.getElementById("customerName")?.value.trim();
    const email = document.getElementById("customerEmail")?.value.trim();
    const phone = document.getElementById("customerPhone")?.value.trim();
    const isValid = name && email && phone && uploadedFile;

    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
      submitBtn.disabled = !isValid;
    }

    return isValid;
  }

  window.submitPayment = function () {
    if (!validateForm()) {
      alert("Please fill in all required fields and upload your receipt.");
      return;
    }

    // Create order summary for confirmation
    const confirmationDetails = document.getElementById("confirmationDetails");
    if (confirmationDetails) {
      let html = `
        <div><span>Reference Code:</span><span>${referenceCode}</span></div>
        <div><span>Package:</span><span>${
          selectedPackage ? selectedPackage.displayName : "Not selected"
        }</span></div>
        <div><span>Amount Paid:</span><span>GH₵ ${totalAmount}</span></div>
        <div><span>Customer Name:</span><span>${
          document.getElementById("customerName").value
        }</span></div>
        <div><span>Email:</span><span>${
          document.getElementById("customerEmail").value
        }</span></div>
        <div><span>Phone:</span><span>${
          document.getElementById("customerPhone").value
        }</span></div>
      `;

      if (selectedAddons.length > 0) {
        html += `<div><span>Add-ons:</span><span>${selectedAddons
          .map((a) => a.name)
          .join(", ")}</span></div>`;
      }

      confirmationDetails.innerHTML = html;
    }

    // Move to confirmation step
    nextStep(4);

    // Here you would typically send the data to your server
    console.log("Payment submitted:", {
      reference: referenceCode,
      package: selectedPackage,
      addons: selectedAddons,
      total: totalAmount,
      customer: {
        name: document.getElementById("customerName").value,
        email: document.getElementById("customerEmail").value,
        phone: document.getElementById("customerPhone").value,
      },
      file: uploadedFile,
    });
  };

  window.contactWhatsApp = function () {
    if (!selectedPackage) {
      alert("Please complete the payment process first.");
      return;
    }

    const message = `Hello Luma Studios! I just submitted my payment for graduation photos.%0A%0AReference: ${referenceCode}%0APackage: ${selectedPackage.name}%0AAmount: GH₵ ${totalAmount}%0A%0ACan you confirm receipt?`;
    window.open(`https://wa.me/233505775705?text=${message}`, "_blank");
  };

  console.log("Payment System Initialized Successfully!");
}

// Smooth scrolling for anchor links
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

// WhatsApp floating button functionality
document.addEventListener("DOMContentLoaded", function () {
  const whatsappFloat = document.querySelector(".whatsapp-float");
  if (whatsappFloat) {
    whatsappFloat.addEventListener("click", function (e) {
      e.preventDefault();
      const message =
        "Hello Luma Studios! I'm interested in your graduation photography services.";
      window.open(
        `https://wa.me/233505775705?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    });
  }
});
// Simple Payment System - Copy Momo Number
document.addEventListener("DOMContentLoaded", function () {
  const packageOptions = document.querySelectorAll(".package-option-simple");
  const addOnCheckboxes = document.querySelectorAll(
    ".add-on-option-simple input"
  );
  const whatsappBtn = document.getElementById("whatsappBtn");

  let selectedPackage = null;
  let selectedAddons = [];
  let totalAmount = 0;
  let referenceCode = "LUMA-" + Math.floor(1000 + Math.random() * 9000);

  // Display initial reference code
  document.getElementById("referenceCode").textContent = referenceCode;

  // Package selection
  packageOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove selected class from all options
      packageOptions.forEach((opt) => opt.classList.remove("selected"));

      // Add selected class to clicked option
      this.classList.add("selected");

      // Update selected package
      selectedPackage = {
        name: this.getAttribute("data-package"),
        price: parseInt(this.getAttribute("data-price")),
      };

      updateOrderSummary();
    });
  });

  // Add-on selection
  addOnCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      updateOrderSummary();
    });
  });

  // Update order summary
  function updateOrderSummary() {
    const summaryPackage = document.getElementById("summary-package");
    const summaryPrice = document.getElementById("summary-price");
    const summaryAddons = document.getElementById("summary-addons");
    const addonsPrice = document.getElementById("addons-price");
    const summaryTotal = document.getElementById("summary-total");

    totalAmount = 0;

    // Update package
    if (selectedPackage) {
      const packageName =
        selectedPackage.name.charAt(0).toUpperCase() +
        selectedPackage.name.slice(1) +
        " Package";
      summaryPackage.textContent = packageName;
      summaryPrice.textContent = `GH₵ ${selectedPackage.price}`;
      totalAmount += selectedPackage.price;
    } else {
      summaryPackage.textContent = "None";
      summaryPrice.textContent = "GH₵ 0";
    }

    // Update addons
    selectedAddons = [];
    let addonsTotal = 0;

    addOnCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const addonPrice = parseInt(
          checkbox.closest(".add-on-option-simple").getAttribute("data-price")
        );
        const addonName = checkbox.nextElementSibling.textContent
          .split("(+")[0]
          .trim();

        selectedAddons.push({
          name: addonName,
          price: addonPrice,
        });

        addonsTotal += addonPrice;
      }
    });

    if (selectedAddons.length > 0) {
      summaryAddons.style.display = "flex";
      addonsPrice.textContent = `GH₵ ${addonsTotal}`;
      totalAmount += addonsTotal;
    } else {
      summaryAddons.style.display = "none";
    }

    // Update total
    summaryTotal.textContent = `GH₵ ${totalAmount}`;

    // Update WhatsApp link
    updateWhatsAppLink();
  }

  // Update WhatsApp link with order details
  function updateWhatsAppLink() {
    let message = `Hello Luma Studios! I've made a payment for graduation photos.%0A%0A`;
    message += `Reference: ${referenceCode}%0A`;

    if (selectedPackage) {
      message += `Package: ${
        selectedPackage.name.charAt(0).toUpperCase() +
        selectedPackage.name.slice(1)
      }%0A`;
    }

    message += `Amount: GH₵ ${totalAmount}%0A%0A`;
    message += `I've sent the payment to 0595048812 (The Blessed Care Montessori).`;

    whatsappBtn.href = `https://wa.me/233505775705?text=${message}`;
  }
});

// Copy Momo Number function
function copyMomoNumber() {
  const momoNumber = document.getElementById("momoNumber").textContent;
  navigator.clipboard.writeText(momoNumber).then(() => {
    // Show copied feedback
    const btn = event.target.closest(".copy-btn");
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    btn.style.background = "#10b981";
    btn.style.color = "white";

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = "";
      btn.style.color = "";
    }, 2000);
  });
}

// Copy Reference Code function
function copyReferenceCode() {
  const referenceCode = document.getElementById("referenceCode").textContent;
  navigator.clipboard.writeText(referenceCode).then(() => {
    // Show copied feedback
    const btn = event.target.closest(".copy-btn");
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    btn.style.background = "#10b981";
    btn.style.color = "white";

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = "";
      btn.style.color = "";
    }, 2000);
  });
}
