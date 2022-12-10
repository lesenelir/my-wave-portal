const hre = require('hardhat')

const main = async  () => {
  // const [owner, randomPerson, randomPerson2] = await hre.ethers.getSigners()
  // 对象数组，每一个对象有address属性
  const signers = await hre.ethers.getSigners()
  const waveAddressArray = []

  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal')
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1")
  })
  await waveContract.deployed()

  console.log('Contract deployed to: ', waveContract.address) // 合约地址
  console.log('Contract deployed by: ', signers[0].address) // 创建合约的地址就是signer的第一个地址

  await waveContract.getTotalWaves()

  // get contract balance to see if my contract has a balance of 0.1 eth
  let contractBalance = await hre.ethers.provider.getBalance(waveContract.address)
  console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance))

  // send wave
  const firstWaveTxn = await waveContract.wave('A message !')
  await firstWaveTxn.wait()
  await waveContract.getTotalWaves()
  waveAddressArray.push(firstWaveTxn.from)

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address)
  console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance))

  for (let i = 1; i < signers.length; i++) {
    const tempWaveTxn = await waveContract.connect(signers[i]).wave('wave message')
    await tempWaveTxn.wait()
    await waveContract.getTotalWaves()
    waveAddressArray.push(tempWaveTxn.from)
  }

  console.log('All wave addresses: ', waveAddressArray)

  // get contract balance to see what happened!
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address)
  console.log('Contract balance: ', hre.ethers.utils.formatEther(contractBalance))

  let allWaves = await waveContract.getAllWaves()
  console.log(allWaves)

  // const secondWaveTxn = await waveContract.connect(signers[1]).wave()
  // await secondWaveTxn.wait()
  // await waveContract.getTotalWaves()
  //
  // const thirdWaveTxn = await waveContract.connect(randomPerson2).wave()
  // await thirdWaveTxn.wait()
  // await waveContract.getTotalWaves()

}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

runMain().then(r => console.log(r))
