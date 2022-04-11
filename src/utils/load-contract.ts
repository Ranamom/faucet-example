import contract from "@truffle/contract"

export const loadContract = async (name: string, provider: any) => {
  const res = await fetch(`/contracts/${name}.json`)
  const Artifact = await res.json()

  // @ts-ignore
  const _contract = contract(Artifact)
  _contract.setProvider(provider)

  const deployedContract = await _contract.deployed()

  return deployedContract
  
}
