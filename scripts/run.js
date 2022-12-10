const hre = require('hardhat')

const main = async  () => {
  // const [owner, randomPerson, randomPerson2] = await hre.ethers.getSigners()
  // 对象数组，每一个对象有address属性
  const signers = await hre.ethers.getSigners()
  const waveAddressArray = []

  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal')
  const waveContract = await waveContractFactory.deploy()
  await waveContract.deployed()

  console.log('Contract deployed to: ', waveContract.address) // 合约地址
  console.log('Contract deployed by: ', signers[0].address) // 创建合约的地址就是signer的第一个地址

  await waveContract.getTotalWaves()

  const firstWaveTxn = await waveContract.wave('A message !')
  await firstWaveTxn.wait()
  await waveContract.getTotalWaves()
  waveAddressArray.push(firstWaveTxn.from)

  for (let i = 1; i < signers.length; i++) {
    const tempWaveTxn = await waveContract.connect(signers[i]).wave('wave message')
    await tempWaveTxn.wait()
    await waveContract.getTotalWaves()
    waveAddressArray.push(tempWaveTxn.from)
  }

  console.log('All wave addresses: ', waveAddressArray)

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
