// $('#files').parse({
//     config: {
//         delimiter: "auto",
//         complete: displayHTMLTable,
//     },
//     before: function(file, inputElem)
//     {
//         //console.log("Parsing file...", file);
//     },
//     error: function(err, file)
//     {
//         //console.log("ERROR:", err, file);
//     },
//     complete: function()
//     {
//         //console.log("Done with all files");
//     }
// });


// function displayHTMLTable(results){
// 	var table = "<table class='table'>";
// 	var data = results.data;
	 
// 	for(i=0;i<data.length;i++){
// 		table+= "<tr>";
// 		var row = data[i];
// 		var cells = row.join(",").split(",");
		 
// 		for(j=0;j<cells.length;j++){
// 			table+= "<td>";
// 			table+= cells[j];
// 			table+= "</th>";
// 		}
// 		table+= "</tr>";
// 	}
// 	table+= "</table>";
// 	$("#parsed_csv_list").html(table);
// }

// var file = new File(["try"], "try.txt", {
//     type: "text/plain",
//   });


// Parse CSV string
// var data = Papa.parse(csv);

// Convert back to CSV
// var csv = Papa.unparse(data);

// Parse local CSV file
// Papa.parse(file, {
// 	complete: function(results) {
// 		console.log("Finished:", results.data);
// 	}
// });

// const fs = require('fs');
// const papa = require('papaparse');
// const file = fs.createReadStream('challenge.csv');
// var count = 0; // cache the running count
// papa.parse(file, {
//     worker: true, // Don't bog down the main thread if its a big file
//     step: function(result) {
//         // do stuff with result
//     },
//     complete: function(results, file) {
//         console.log('parsing complete read', count, 'records.'); 
//     }
// });

file = 'https://gist.githubusercontent.com/DysonMa/89f6d8f53ad84df07a963f8333857f39/raw/006f93ede6d754a854b7692728e6453b4e85dfd7/question.txt'
// 'C:/Users/madi/Documents/sinopac-game/public/js/question.csv';

// var reader = new FileReader();

// function printFile(file) {
//     var reader = new FileReader();
//     reader.onload = function(evt) {
//       console.log(evt.target.result);
//     };
//     reader.readAsText(file);
//   }

// printFile(file)

a = []

d3.csv(file, function(data){
	a.push(data); //用table的方式在console呈現json
	// d3.select('.demo').text(JSON.stringify(data)) //把json寫到.demo上
  return a;
});




// ques_list = [{ 
//   q_id:'1',
//   ques:'35歲新婚夫妻成家，DA虎想買房成家，DAWHO該如何翻轉他的人生?',
//   A:'外幣',
//   B:'DA優貸',
//   C:'輕房貸',	
//   D:'信用卡',
//   ans:'大戶輕房貸利率最低1.4%起，成數最高85%期限最長40年'
// }];