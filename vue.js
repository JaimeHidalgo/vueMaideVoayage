

new Vue({
    el: '#app',
    data(){
        return {
            info: null
        }
    },
    mounted () {
        const url = `https://api.etherscan.io/api?module=account&action=txlist&address=0xb794f5ea0ba39494ce839613fffba74279579268&startblock=0&endblock=99999999&sort=asc&apikey=`; 
        d3.json(url).then((data,error)=>{
            if(error) console.log(`the error is ${error}`);
            
            const transactions = d3.rollup(data["result"],v=> v.length,d=>d.from);
            
            // set the dimensions and margins of the graph
            const margin = {top: 30, right: 30, bottom: 70, left: 60};
            const width = 3000 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            // append the svg object to the body of the page
            var svg = d3.select("#plot")
                        .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

            
            // X axis
            
            const x = d3.scaleBand()
                      .range([ 0, width ])
                      .domain(transactions)
                      .padding(0.2);
           
            svg.append("g")
               .attr("transform", "translate(0," + height + ")")
               .call(d3.axisBottom(x))
               .selectAll("text")
               .attr("transform", "translate(-10,0)rotate(-45)")
               .style("text-anchor", "end");
            
            // Add Y axis
            var y = d3.scaleBand()
                      .range([ 0,height])
                      .domain(transactions.values())
                      .padding(0.2);

            svg.append("g")
               .call(d3.axisLeft(y));
            // Bars
            svg.selectAll("mybar")
                .data(transactions)
                .enter()
                .append("rect")
                .attr("x", d => x(d.keys()))
                .attr("y", d => y(d.values()))
                .attr("width", 10)
                .attr("height", transactions.forEach(e=> {return height - e}))
                .attr("fill", "#69b3a2")


        });
    }
    
})