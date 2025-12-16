import { useWriteContract, useReadContract, useAccount } from 'wagmi'
import { VAULT_ABI, VAULT_ADDRESS } from '@/abi/Vault'

export const useVault = () => {
    const { writeContractAsync } = useWriteContract()
    const { address } = useAccount()

    const forceWithdraw = async (amount: bigint) => {
        if (!address) return
        return writeContractAsync({
            abi: VAULT_ABI,
            address: VAULT_ADDRESS,
            functionName: 'forceWithdraw',
            args: [amount],
        })
    }

    const requestWithdraw = async () => {
        if (!address) return
        return writeContractAsync({
            abi: VAULT_ABI,
            address: VAULT_ADDRESS,
            functionName: 'requestWithdraw',
            args: [],
        })
    }

    return { forceWithdraw, requestWithdraw }
}

export const useVaultBalance = (address?: `0x${string}`) => {
    return useReadContract({
        abi: VAULT_ABI,
        address: VAULT_ADDRESS,
        functionName: 'balances',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    })
}
