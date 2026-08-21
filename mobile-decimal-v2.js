/* =========================================================
   Umick Expense Tracker - Mobile Decimal Compatibility V2.1
   iPhone / iPad / Android / Tablet
   ========================================================= */
(() => {
  "use strict";

  const thaiDigits = "๐๑๒๓๔๕๖๗๘๙";

  function thaiDigitsToArabic(value) {
    return String(value ?? "").replace(/[๐-๙]/g, digit =>
      String(thaiDigits.indexOf(digit))
    );
  }

  function normalizeMoneyText(value) {
    let raw = thaiDigitsToArabic(value)
      .replace(/\s+/g, "")
      .replace(/[^0-9.,]/g, "");

    if (!raw) return "";

    const lastDot = raw.lastIndexOf(".");
    const lastComma = raw.lastIndexOf(",");

    // Locale keyboards may provide comma instead of dot.
    if (lastComma > lastDot) {
      const commaLooksDecimal = raw.length - lastComma - 1 <= 2;
      if (commaLooksDecimal) {
        const before = raw.slice(0, lastComma).replace(/[.,]/g, "");
        const after = raw.slice(lastComma + 1).replace(/[.,]/g, "");
        raw = `${before}.${after}`;
      } else {
        raw = raw.replace(/,/g, "");
      }
    } else {
      raw = raw.replace(/,/g, "");
    }

    const firstDot = raw.indexOf(".");
    if (firstDot !== -1) {
      raw = raw.slice(0, firstDot + 1) + raw.slice(firstDot + 1).replace(/\./g, "");
    }

    return raw;
  }

  window.cleanNumber = function(value) {
    const number = Number(normalizeMoneyText(value));
    return Number.isFinite(number) ? number : 0;
  };

  window.formatMoneyInput = function(event) {
    const input = event.target;
    if (!String(input.value || "").trim()) return;

    const number = window.cleanNumber(input.value);
    input.value = number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Override the legacy validators so formatted values such as 1,234.50
  // and locale values such as 1234,50 are accepted correctly.
  window.validateIncome = function() {
    if (incomeDate.value === "") {
      showError("กรุณาเลือกวันที่");
      incomeDate.focus();
      return false;
    }
    if (incomeItem.value.trim() === "") {
      showError("กรุณากรอกชื่อรายการ");
      incomeItem.focus();
      return false;
    }
    if (window.cleanNumber(incomeAmount.value) <= 0) {
      showError("กรุณากรอกจำนวนเงิน");
      incomeAmount.focus();
      return false;
    }
    if (incomeGroup.value === "") {
      showError("กรุณาเลือกกลุ่ม");
      incomeGroup.focus();
      return false;
    }
    return true;
  };

  window.validateExpense = function() {
    if (expenseDate.value === "") {
      showError("กรุณาเลือกวันที่");
      expenseDate.focus();
      return false;
    }
    if (expenseItem.value.trim() === "") {
      showError("กรุณากรอกชื่อรายการ");
      expenseItem.focus();
      return false;
    }
    if (window.cleanNumber(expenseAmount.value) <= 0) {
      showError("กรุณากรอกจำนวนเงิน");
      expenseAmount.focus();
      return false;
    }
    if (expenseGroup.value === "") {
      showError("กรุณาเลือกกลุ่ม");
      expenseGroup.focus();
      return false;
    }
    return true;
  };

  const normalizeWhileTyping = event => {
    const input = event.target;
    const normalized = normalizeMoneyText(input.value);
    if (input.value !== normalized) input.value = normalized;
  };

  document.addEventListener("DOMContentLoaded", () => {
    ["incomeAmount", "expenseAmount"].forEach(id => {
      const input = document.getElementById(id);
      if (!input) return;

      input.setAttribute("type", "text");
      input.setAttribute("inputmode", "decimal");
      input.setAttribute("enterkeyhint", "done");
      input.setAttribute("autocomplete", "off");
      input.setAttribute("autocapitalize", "off");
      input.setAttribute("spellcheck", "false");
      input.setAttribute("pattern", "[0-9๐-๙]*[.,]?[0-9๐-๙]*");
      input.addEventListener("input", normalizeWhileTyping);
    });
  }, { once: true });
})();
