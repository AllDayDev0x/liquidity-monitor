const ethers = require("ethers");
const abi = require("./abi.json")
const pair_abi = require("./pair_abi.json")
const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/-IAWnLgBa7yqZ3B2ImokR0eyEEhdWKk5')
const token_abi = require("./token_abi.json");
// const provider = ethers.getDefaultProvider()
// const uniswapFactoryAddress = "0x";
const uniswapFactory = new ethers.Contract("0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",abi,provider);

const basecoin = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

const Liquiditytrack=async(tokenAddr)=>{
    console.log("start")
    const pairAddress = await uniswapFactory.getPair(basecoin,tokenAddr);
    if(pairAddress=="0x0000000000000000000000000000000000000000") return;
    console.log("start")
    console.log(pairAddress,":pair address")
    let pairContract = new ethers.Contract(pairAddress,pair_abi,provider)
    let tokenContract = new ethers.Contract(tokenAddr, token_abi,provider);
    let amount =await tokenContract.balanceOf(pairAddress);
    amount > 0 ? console.log("Trading Enabled"): console.log("Trading Disabled");
//     let iface=new ethers.utils.Interface([ "event Mint(address indexed sender, uint256 amount0, uint256 amount1)" ])
//    let aa =provider.getLogs({address:pairAddress,fromBlock:	0})
//    aa.then((events)=>{
//    console.log("printing array of envents:")
//    let logs=events.map(log=>iface.parseLog(log))
//    console.log(logs);
//    }).catch(function(err){
//     console.log(err)
//    })
//     console.log(aa,"log")
    let eventFilter=pairContract.filters.Burn()
    let events= await pairContract.queryFilter(eventFilter)
    console.log(events[events.length-1])
    pairContract.on("Mint", async (e) => {
        
        console.log("Liquidity has been added");
        amount =await tokenContract.balanceOf(pairAddress);
        amount > 0 ? console.log("Trading Enabled"): console.log("Trading Disabled");
    })
    pairContract.on("Burn", async (e) => {
        console.log("Liquidity has been removed");
        amount =await tokenContract.balanceOf(pairAddress);
        amount > 0 ? console.log("Trading Enabled"): console.log("Trading Disabled");
    })
    
        
     
        
          
}
Liquiditytrack("0x0fa8744455bcae0ecf3236fc803dc54f5a5b197a");
