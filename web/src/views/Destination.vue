<template>
  <div class="pt-12 text-center">
    <h1 class="mb-8 text-2xl font-bold">
      Bridge from {{destinationNetwork}} to {{originNetwork}}
    </h1>

    <p>
      This bridge allows you to send Crossed BONE (xBONE) from {{destinationNetwork}} back to {{originNetwork}}
    </p>

    <WalletConnect
      class="my-4"
      :targetNetwork="destinationNetwork"
      :targetNetworkId="destinationNetworkId"
      :currency="MATIC"
      :decimals="18"
      :isNewNetwork="true"
    />

    <form class="mx-auto mt-8 w-96">
      <label for="price" class="block mb-2 font-medium text-gray-700"
        >How much xBONE do you want to bridge?</label
      >
      <div class="relative w-2/3 mx-auto mt-4 rounded-md shadow-sm">
        <div
          class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
        >
          <span class="text-gray-500 sm:text-sm"> $ </span>
        </div>
        <input
          type="text"
          v-model="amount"
          name="price"
          id="price"
          class="block w-full pr-12 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pl-7 sm:text-sm"
          placeholder="0.00"
          aria-describedby="price-currency"
        />
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
        >
          <span class="text-gray-500 sm:text-sm" id="price-currency">
            xBONE
          </span>
        </div>
      </div>
      <p class="mt-1 text-xs">Your balance is: {{ walletBalance }}</p>

      <button
        type="button"
        class="inline-flex items-center px-4 py-2 mt-4 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        @click="sendTokens"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 mr-3 m-ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {{ trxInProgress ? `Processing...` : `Bridge to ${originNetwork}` }}
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ethers, BigNumber } from 'ethers'

import { useWalletStore } from '../stores/wallet'
import WalletConnect from '@/components/WalletConnect.vue'

import DChainstackDollars from '@/artifacts/contracts/DestinationToken.sol/DChainstackDollars.json'
import ChainstackDollars from '@/artifacts/contracts/OriginToken.sol/ChainstackDollars.json'

export default defineComponent({
  components: { WalletConnect },
  setup() {
    const trxInProgress = ref<boolean>(false)

    const walletStore = useWalletStore()
    const amount = ref<String>('')
    const walletBalance = ref<Number>(0)
    const originTokenAddress = import.meta.env.VITE_ORIGIN_TOKEN_ADDRESS

    const destinationTokenAddress = import.meta.env
      .VITE_DESTINATION_TOKEN_ADDRESS

    const originNetwork = import.meta.env.VITE_ORIGIN_NETWORK_NAME
    const destinationNetwork = import.meta.env.VITE_DESTINATION_NETWORK_NAME
    const destinationNetworkId = import.meta.env.VITE_DESTINATION_NETWORK_ID

    const bridgeWallet = import.meta.env.VITE_BRIDGE_WALLET

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // get the account that will pay for the trasaction
    const signer = provider.getSigner()

    let contract = new ethers.Contract(
      destinationTokenAddress,
      DChainstackDollars.abi,
      signer
    )

    let ethContract = new ethers.Contract(
      originTokenAddress,
      ChainstackDollars.abi,
      signer
    )

    const checkBalance = async function () {
      // if (walletStore.address) {
      try {
        console.log('checking balane')
        console.log('walletStore.address :>> ', walletStore.address)
        let balance = await contract.balanceOf(walletStore.address)
        balance = ethers.utils.formatUnits(balance, 18)
        console.log('balance :>> ', balance)
        walletBalance.value = balance
      } catch (error) {
        console.error('Error checking balance', error)
      }
      // }
    }

    const sendTokens = async function () {
      const amountFormatted = ethers.utils.parseUnits(amount.value, 18)
      console.log('amountFormatted :>> ', amountFormatted)
      console.log('amountFormatted.toString() :>> ', amountFormatted.toString())

      //@ts-expect-error Window.ethers not TS
      if (typeof window.ethereum !== 'undefined') {
        trxInProgress.value = true
        //@ts-expect-error Window.ethers not TS
        // const provider = new ethers.providers.Web3Provider(window.ethereum)
        // get the account that will pay for the trasaction
        // const signer = provider.getSigner()
        // as the operation we're going to do is a transaction,
        // we pass the signer instead of the provider
        // const contract = new ethers.Contract(
        //   contractAddress,
        //   ChainstackDollars.abi,
        //   signer
        // )

        try {
          const transaction = await contract.transfer(
            bridgeWallet,
            amountFormatted.toString()
          )

          console.log('transaction :>> ', transaction)
          // wait for the transaction to actually settle in the blockchain
          await transaction.wait()
          amount.value = 0
          trxInProgress.value = false
        } catch (error) {
          console.error(error)
          trxInProgress.value = false
        }
      }
    }

    return {
      walletStore,
      trxInProgress,
      amount,
      walletBalance,
      sendTokens,
      checkBalance,
      originNetwork,
      destinationNetworkId,
      destinationNetwork,
    }
  },

  mounted() {},

  computed: {
    accAvailable() {
      return useWalletStore().address
    },
  },
  watch: {
    async accAvailable(newVal, old) {
      console.log(`updating from ${old} to ${newVal}`)
      await this.checkBalance()
    },
  },
})
</script>
