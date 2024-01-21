
const scriptURL = "https://script.google.com/macros/s/AKfycbwalalaC_k_tWT6B6TVw4jEWGiGfkO86LKwqF0u0Fu2l7TfcYDmwg1XTzfilNrH4caozQ/exec"

const form = document.forms['myForm']



form.addEventListener('submit', e =>{
    e.preventDefault()



        // TRADE DATA 
var risk_to_reward_ratio = document.getElementById("risk").value;
var pair = document.getElementById("pair").value;
var sell_or_buy = document.getElementById("sell-buy").value;
var type = document.getElementById("type").value;
var price = document.getElementById("price").value;
var stop = document.getElementById("stop").value;
var resultElement = document.getElementById('profit-price');
var profit = document.getElementById('profit');
var pro_pips = document.getElementById('profit-pips');
var los_pips = document.getElementById('loss-pips');

var profit_price = getProfitValue(risk_to_reward_ratio,price,stop,sell_or_buy,type,price,resultElement);

resultElement.innerHTML = 'Profit price ' + profit_price;
      

profit.value = profit_price;


// GET PROFIT PIPS 

var profit_pips = getProfitPips(risk_to_reward_ratio,price,stop,sell_or_buy,type)
    
pro_pips.value = profit_pips;

// GET STOP LOSS PIPS 
var loss_pips = getLossPips(risk_to_reward_ratio,price,stop,sell_or_buy,type)

los_pips.value = loss_pips; 



//var loss_pips = getLossPips(risk_to_reward_ratio,stop,stop,sell_or_buy,type)

// SEND DATA TO GOOGLE SHEET -----------------------------------

    fetch(scriptURL,{method: 'POST', body:  new FormData(form)}
).then(respone => alert("Data has been sucessfully added!!")).then(()=> {window.location.reload();})
.catch(error => console.error('Error', error.message))

},

)
//.then(()=> {window.location.reload();})


function getPipsDifference(openingPrice, closingPrice, decimalPlaces,tradeType) {

    const conversionFactor = Math.pow(10, decimalPlaces);
var pips;
    // Calculate the number of pips
    if (tradeType == "Sell"){
     pips = (closingPrice - openingPrice) * conversionFactor;
   

}
else if(tradeType == "Buy"){
    pips = (openingPrice - closingPrice ) * conversionFactor;
}
    return Math.round(pips);
}

function getProfitValue(risk,price,stop,tradeType,type,open,resultElement){
    var numberOfPips;

    if (type == "Non-Yen"){
        // Get the pips difference between stop loss and open price 
     numberOfPips = getPipsDifference(price, stop, 4,tradeType);
        // console.log('Number of pips:', numberOfPips);
    
    }else {
         numberOfPips = getPipsDifference(price, stop, 2, tradeType);
        // console.log('Number of pips:', numberOfPips);
    }

    // double or triple value if 1:1 just add the pips 
    var profit_pips;
    switch(risk) {
        case "1:1":
          profit_pips = numberOfPips;
          break;
        case "2:1":
            profit_pips = numberOfPips * 2;
          break;
          case "3:1":
            profit_pips = numberOfPips * 3;
          break;
        default:
            profit_pips = numberOfPips * 3;
      }

    //  console.log("Profit pips : " + profit_pips);

    //add the pips to open price to get profit value 
    if (type == "Non-Yen"){
        const conversionFactor = Math.pow(10, 4);
        const rateChange = profit_pips / conversionFactor;
//console.log("rateChange" + rateChange)
var newRate;
       if(tradeType == "Buy"){
         newRate = parseFloat(open) + parseFloat(rateChange);
      //   console.log("Buy price" + newRate.toFixed(4))
       }
       else{
        newRate = parseFloat(open) - parseFloat(rateChange);
        //console.log("Sell price" + newRate.toFixed(4))
       }
       return newRate.toFixed(4); 
      
    }else {
        const conversionFactor = Math.pow(10, 2);
        const rateChange = profit_pips / conversionFactor;

        if(tradeType == "Buy"){
            newRate = parseFloat(open) + parseFloat(rateChange);
          
          }
          else{
           newRate = parseFloat(open) - parseFloat(rateChange);
          }
    
        return newRate.toFixed(2); 
    }
}


function getProfitPips(risk,price,stop,tradeType,type,){
  var numberOfPips;

  if (type == "Non-Yen"){
      // Get the pips difference between stop loss and open price 
   numberOfPips = getPipsDifference(price, stop, 4,tradeType);
      // console.log('Number of pips:', numberOfPips);
  
  }else {
       numberOfPips = getPipsDifference(price, stop, 2, tradeType);
      // console.log('Number of pips:', numberOfPips);
  }

  // double or triple value if 1:1 just add the pips 
  var profit_pips;
  switch(risk) {
      case "1:1":
        profit_pips = numberOfPips;
        break;
      case "2:1":
          profit_pips = numberOfPips * 2;
        break;
        case "3:1":
          profit_pips = numberOfPips * 3;
        break;
      default:
          profit_pips = numberOfPips * 3;
    }

    //console.log("Profit pips to send : " + profit_pips)
  
    return profit_pips
  }

  function getLossPips(risk,price,stop,tradeType,type,){
    var numberOfPips;
  
    if (type == "Non-Yen"){
        // Get the pips difference between stop loss and open price 
     numberOfPips = getPipsDifference(price, stop, 4,tradeType);
         //console.log('Number of loss pips:', numberOfPips);
       
    
    }else {
         numberOfPips = getPipsDifference(price, stop, 2, tradeType);
         //console.log('Number of loss pips:', numberOfPips);
        
    }
    return numberOfPips;
  }