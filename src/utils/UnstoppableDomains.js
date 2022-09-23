import Resolution from '@unstoppabledomains/resolution/build/Resolution'

const resolution = new Resolution()

export const resolveUrl = async (domain) => {
  let isRegistered = true
  let resolvedAddress = null

  await resolution
    .isRegistered(domain)
    .then((isDomainRegistered) => (isRegistered = isDomainRegistered))
    .catch(console.error)

  if (isRegistered) {
    await resolution
      .addr(domain, 'ETH')
      .then((address) => (resolvedAddress = address))
      .catch(console.error)
  }

  return resolvedAddress
}

export const reverseUrl = async (address) => {
  let url = null

  await resolution
    .reverse(address, { location: 'UNSLayer2' })
    .then((domain) => (url = domain))
    .catch(console.error)

  return url
}
