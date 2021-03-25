  //vars
    const inputCurrency = document.querySelector("#input-currency");
    const inputWeight = document.querySelector("#input-weight");
    const inputVol = document.querySelector("#input-vol");
    const inputDays = document.querySelector("#input-days");
    const btnCalc = document.querySelector(".btn-calc");
    const btnChoose = document.querySelector(".btn-choose");
    const selector = document.querySelector("#select-pod");
    const selectorMainPage = document.querySelector("#select-pol");
    const hiddenDiv = document.querySelector(".container-hidden");
    const visibleDiv = document.querySelector(".container-visible");
    const para = document.querySelector(".print-awb");
    const paraDisclaimer = document.querySelector(".disclaimer");
    const inputPercent = document.querySelector("#input-per");
    
    let interchanged = false;


    //div containers interchanger
    btnChoose.addEventListener("click", function () {
      hiddenDiv.setAttribute("class", "get-visible");
      visibleDiv.setAttribute("class", "container-hidden");
      interchanged = true;
    });

    //select area:hover transitions
    selectorMainPage.addEventListener("mouseenter", function () {
      selectorMainPage.style.width = "250px";
      selectorMainPage.style.transition = "all, ease, 0.6s";
    });

    selectorMainPage.addEventListener("mouseleave", function () {
      selectorMainPage.style.width = "100px";
      selectorMainPage.style.transition = "all, ease, 0.6s";
    });

    //pol chrgs selector dpnding on selectedIndex
    function returnPortValue() {
      if (
        selectorMainPage.options[selectorMainPage.selectedIndex].text === "CN"
      ) {
        if (returnChrgw() > 0 && returnChrgw() <= 300) {
          return 6.96;
        } else if (returnChrgw() > 300 && returnChrgw() <= 500) {
          return 6.36;
        } else if (returnChrgw() > 500) {
          return 5.76;
        }
      } else if (
        selectorMainPage.options[selectorMainPage.selectedIndex].text === "KOR"
      ) {
        if (returnChrgw() > 0 && returnChrgw() <= 300) {
          return 7.44;
        } else if (returnChrgw() > 300 && returnChrgw() <= 500) {
          return 6.36;
        } else if (returnChrgw() > 500) {
          return 5.64;
        }
      }
    }

    //object constructor func. - pods
    class Airport {
      constructor(
        id,
        name,
        awbFixRate,
        consigneeNotification,
        handlingRate,
        loadingRate,
        exist
      ) {
        this.id = id;
        this.name = name;
        this.awbFixRate = awbFixRate;
        this.consigneeNotification = consigneeNotification;
        this.handlingRate = handlingRate;
        this.loadingRate = loadingRate;
        this.exist = true;
        //storage rates calculation
        this.storageRate = function () {
          for (let j = 0; j < airportsArray.length; j++) {
            //SVO1
            if (
              selector.options[selector.selectedIndex].text ===
              airportsArray[0].id
            ) {
              if (inputDays.value <= 3) {
                return 0;
              } else if (inputDays.value > 3 && inputDays.value <= 5) {
                return Number(10.16 * returnChrgw()) * Number(inputDays.value - 3);
              } else if (inputDays.value > 5) {
                return Number(17.88 * returnChrgw()) * Number(inputDays.value - 3);
              }
            } //SVO2
            else if (
              selector.options[selector.selectedIndex].text ===
              airportsArray[1].id
            ) {
              if (inputDays.value <= 4) {
                return 0;
              } else if (inputDays.value > 4 && inputDays.value <= 5) {
                return Number(7.44 * returnChrgw()) * Number(inputDays.value - 4);
              } else if (inputDays.value > 5 && inputDays.value <= 10) {
                return Number(9.96 * returnChrgw()) * Number(inputDays.value - 4);
              } else if (inputDays.value > 10) {
                return Number(11.4 * returnChrgw()) * Number(inputDays.value - 4);
              }
            } //DME
            else if (
              selector.options[selector.selectedIndex].text ===
              airportsArray[2].id
            ) {
              if (inputDays.value <= 2) {
                return 0;
              } else if (inputDays.value > 2) {
                return Number(9.9 * returnChrgw()) * Number(inputDays.value - 2);
              }
            } //LED
            else if (
              selector.options[selector.selectedIndex].text ===
              airportsArray[3].id
            ) {
              if (inputDays.value <= 3) {
                return 0;
              } else if (inputDays.value > 3) {
                return Number(6.84 * returnChrgw()) * Number(inputDays.value - 3);
              }
            }
          }
        };
      }
    }

    //chargable weight calculation
    let returnChrgw = function () {
      return Math.max(Number(inputWeight.value), Number(inputVol.value) * 167);
      /*   Number(
          Number(Math.max(inputWeight.value,inputVol.value * 167)).toFixed(2)
        ); */
    };

   

    //Object instancies
    const sherCargoOne = new Airport(
      "SVO1",
      "Москва-Карого (SVO1)",
      0,
      344.4,
      19.48,
      3.36,
      false
    );

    const sherCargoTwo = new Airport(
      "SVO2",
      "Шереметьево-Карого (SVO2)",
      Number((618.64 * 1.2).toFixed(2)),
      Number((237.29 * 1.2).toFixed(2)),
      Number((18.2 * 1.2).toFixed(2)),
      Number((2.4 * 1.2).toFixed(2)),
      false
    );

    const Dme = new Airport(
      "DME",
      "Домодедово",
      0,
      441.9,
      Number((13.95 * 1.2).toFixed(2)),
      Number((2.5 * 1.2).toFixed(2)),
      false
    );

    const Led = new Airport(
      "LED",
      "Пулково",
      Number((770 * 1.2).toFixed(2)),
      Number((350 * 1.2).toFixed(2)),
      Number((7.65 * 1.2).toFixed(2)),
      Number((3 * 1.2).toFixed(2)),
      false
    );

    //Pushing up the array obj.
    const airportsArray = [sherCargoOne, sherCargoTwo, Dme, Led];

    //here is our little calc prototype
    Airport.prototype.calculate = function () {
      return (
        this.awbFixRate +
        this.consigneeNotification +
        this.handlingRate * returnChrgw() +
        this.loadingRate * returnChrgw() +
        Number(this.storageRate()) +
        localCarriagecalc() +
        Number(inputCurrency.value) * (( returnPortValue() * returnChrgw() ) + (( returnPortValue() * returnChrgw() ) * Number(inputPercent.value)/100))
      );
    };

    //info printout
    Airport.prototype.printout = function () {
      para.innerHTML =
        `Расчет произведен для рабочего веса ${new Intl.NumberFormat(
          "ru-RU"
        ).format(returnChrgw())} кг.` +
        "<br/>" +
        `Авианакладная: ${new Intl.NumberFormat("ru-RU").format(
          this.awbFixRate
        )} руб.` +
        "<br/>" +
        `Телеграмма: ${new Intl.NumberFormat("ru-RU").format(
          this.consigneeNotification
        )} руб.` +
        "<br/>" +
        `Терминальная обработка: ${new Intl.NumberFormat("ru-RU").format(
          this.handlingRate * returnChrgw()
        )} руб.` +
        "<br/>" +
        `ПРР: ${new Intl.NumberFormat("ru-RU").format(
          this.loadingRate * returnChrgw()
        )} руб.` +
        "<br/>" +
        `Хранение: ${new Intl.NumberFormat("ru-RU").format(
          this.storageRate())} руб.` +
        "<br/>" +
        `Вывоз с СВХ: ${new Intl.NumberFormat("ru-RU").format(
          localCarriagecalc()
        )} руб.` +
        "<br/>" +
        `Стоимость фрахта: ${new Intl.NumberFormat("ru-RU").format(
          Number(inputCurrency.value) * (( returnPortValue() * returnChrgw() ) + (( returnPortValue() * returnChrgw() ) * Number(inputPercent.value)/100))
        )} руб.` +
          "<br/>";
    };

    //and simple implementation
    function loopMaster() {
      if (
        inputDays.value < 0 ||
        inputVol.value <= 0 ||
        inputWeight.value <= 0 ||
        inputCurrency.value <= 0 ||
	inputPercent.value < 0
      ) {
        alert("Заполните все поля!");
      } else {
        for (let i = 0; i < airportsArray.length; i++) {
          if (
            selector.options[selector.selectedIndex].text ===
            airportsArray[i].id
          ) {
            airportsArray[i].exist = true;
            airportsArray[i].calculate();
            airportsArray[i].printout();
            const total = airportsArray[i].calculate().toFixed(2);
	    const totalPrintout = document.createElement('div');
	    totalPrintout.innerHTML = `<p> Итого расходы по данной поставке составят <span>${new Intl.NumberFormat(
                "ru-RU"
              ).format(total)} руб.</span></p>`;
	
	   
            para.appendChild(totalPrintout);
	    
            paraDisclaimer.setAttribute("class", "disclaimer-to-visible");
          }
        }
      }
    }
    //local carriage charges
    function localCarriagecalc() {
      if (returnChrgw() <= 500) {
        return 7000;
      } else if (returnChrgw() > 500 && returnChrgw() <= 2000) {
        return 15000;
      } else if (returnChrgw() > 2000) {
        return 23000;
      }
    }

    btnCalc.addEventListener("click", loopMaster);
    window.addEventListener ('keydown', (e)=>{
	if(e.key === 'Enter' && interchanged === true){
	loopMaster();
}
     })