export enum ErrorCodes {
  INSUFFICIENT_FUNDS = 'Insufficient funds to complete the transaction.',
  USER_REJECTED_REQUEST = 'You refused the transaction. Please authorize to continue.',
  NETWORK_ERROR = 'Failed to connect to the blockchain. Check your internet connection and try again.',
  INVALID_ARGUMENT = 'An error occurred while processing the transaction. Check the inserted values.',
  UNPREDICTABLE_GAS_LIMIT = 'Could not accurately estimate the required gas. Please try again later.',
  TRANSACTION_FAILED = 'The transaction failed. It could be a problem with the blockchain or your wallet.',
  TIMEOUT = 'It took too long for the transaction to be confirmed. Please try again.',
  UNKNOWN_ERROR = 'An unexpected error has occurred. Check the console for more details.',
}
