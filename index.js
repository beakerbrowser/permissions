const isDatHashRegex = /^[a-z0-9]{64}/i

exports.PERMS = {
  js: {
    persist: true,
    idempotent: true,
    alwaysDisallow: false,
    requiresRefresh: true,
    experimental: false
  },
  network: {
    persist: true,
    idempotent: true,
    alwaysDisallow: false,
    requiresRefresh: true,
    experimental: false
  },
  createDat: {
    persist: false,
    idempotent: false,
    alwaysDisallow: false,
    requiresRefresh: false,
    experimental: false
  },
  modifyDat: {
    persist: 'allow', // dont persist 'deny'
    idempotent: true,
    alwaysDisallow: false,
    requiresRefresh: false,
    experimental: false
  },
  deleteDat: {
    persist: false,
    idempotent: false,
    alwaysDisallow: false,
    requiresRefresh: false,
    experimental: false
  },
  media: {
    persist: true,
    idempotent: true,
    alwaysDisallow: false,
    requiresRefresh: false,
    experimental: false
  },
  geolocation: {
    persist: false,
    idempotent: true,
    alwaysDisallow: true, // NOTE geolocation is disabled, right now
    requiresRefresh: false,
    experimental: false
  },
  notifications: {
    persist: true,
    idempotent: true,
    alwaysDisallow: false,
    requiresRefresh: false,
    experimental: false
  },
  midiSysex: {
    persist: false,
    idempotent: true,
    alwaysDisallow: false,
    requiresRefresh: false,
    experimental: false
  },
  pointerLock: {
    persist: false,
    idempotent: true,
    alwaysDisallow: false,
    requiresRefresh: false,
    experimental: false
  },
  fullscreen: {
    persist: true,
    idempotent: false,
    alwaysAllow: false,
    alwaysDisallow: false,
    requiresRefresh: false,
    experimental: false
  },
  download: {
    persist: false,
    idempotent: false,
    alwaysDisallow: false,
    requiresRefresh: false,
    experimental: false
  },
  dangerousAppControl: {
    persist: true,
    idempotent: false,
    alwaysAllow: false,
    requiresRefresh: false,
    experimental: false
  },
  openExternal: {
    persist: false,
    idempotent: false,
    alwaysDisallow: false,
    requiresRefresh: false,
    experimental: false
  },
  experimentalLibrary: {
    persist: true,
    idempotent: true,
    alwaysDisallow: false,
    requiresRefresh: false,
    experimental: true
  },
  experimentalLibraryRequestAdd: {
    persist: false,
    idempotent: false,
    alwaysDisallow: false,
    requiresRefresh: false,
    experimental: true
  },
  experimentalLibraryRequestRemove: {
    persist: false,
    idempotent: false,
    alwaysDisallow: false,
    requiresRefresh: false,
    experimental: true
  },
  experimentalGlobalFetch: {
    persist: true,
    idempotent: true,
    alwaysDisallow: false,
    requiresRefresh: false,
    experimental: true
  },
  experimentalDatPeers: {
    persist: true,
    idempotent: true,
    alwaysAllow: true,
    alwaysDisallow: false,
    requiresRefresh: false,
    experimental: true
  },
  experimentalCapturePage: {
    persist: false,
    idempotent: false,
    alwaysDisallow: false,
    requiresRefresh: false,
    experimental: true
  }
}

exports.PERM_ICONS = {
  js: 'fas fa-code',
  network: 'fas fa-cloud',
  createDat: 'fas fa-folder-open',
  modifyDat: 'fas fa-folder-open',
  deleteDat: 'fas fa-folder-open',
  media: 'fas fa-video',
  geolocation: 'fas fa-map-marked',
  notifications: 'fas fa-bell',
  midiSysex: 'fas fa-headphones',
  pointerLock: 'fas fa-mouse-pointer',
  fullscreen: 'fas fa-arrows-alt',
  download: 'fas fa-download',
  openExternal: 'fas fa-external-link-alt',
  experimentalLibrary: 'fas fa-book',
  experimentalLibraryRequestAdd: 'fas fa-upload',
  experimentalLibraryRequestRemove: 'fas fa-times',
  experimentalGlobalFetch: 'fas fa-download',
  experimentalDatPeers: 'fas fa-exchange-alt',
  experimentalCapturePage: 'fas fa-camera',
  dangerousAppControl: 'fas fa-flask'
}

exports.renderPermDesc = function renderPermDesc ({html, bg, url, permId, permParam, permOpts}) {
  const api = bg ? (bg.shellMenus || bg.permPrompt) : null
  const openUrl = url => e => {
    e.preventDefault()
    e.stopPropagation()
    url = isDatHashRegex.test(url) ? `dat://${url}` : url
    if (api) api.createTab(url)
    else beaker.browser.openUrl(url, {setActive: true})
  }
  switch (permId) {
    case 'js': return 'Run Javascript'
    case 'media': return 'Use your camera and microphone'
    case 'geolocation': return 'Know your location'
    case 'notifications': return 'Create desktop notifications'
    case 'midiSysex': return 'Access your MIDI devices'
    case 'pointerLock': return 'Lock your cursor'
    case 'fullscreen': return 'Go fullscreen'
    case 'openExternal': return `Open this URL in another program: ${shorten(url, 128)}`
    case 'experimentalLibrary': return 'Read and modify your Library'
    case 'experimentalDatPeers': return 'Send and receive messages with peers'
    case 'dangerousAppControl': return 'Read and write your data, including bookmarks, archives, and files'

    case 'network':
      if (permParam === '*') return 'Access the network freely'
      return 'contact ' + permParam

    case 'download':
      return html`<span>Download ${permOpts.filename}</span>`

    case 'createDat':
      if (permOpts.title) return `Create a new Dat archive, "${permOpts.title}"`
      return 'Create a new Dat archive'

    case 'modifyDat':
      {
        let viewArchive = openUrl(permParam)
        return html`<span>Write files to <a @click=${viewArchive}>${permOpts.title}</a></span>`
      }

    case 'deleteDat':
      {
        let viewArchive = openUrl(permParam)
        return html`<span>Delete the archive <a @click=${viewArchive}>${permOpts.title}</a></span>`
      }

    case 'experimentalLibraryRequestAdd':
      {
        let viewArchive = openUrl(permParam)
        return html`<span>Seed <a @click=${viewArchive}>${permOpts.title}</a></span>`
      }

    case 'experimentalLibraryRequestRemove':
      {
        let viewArchive = openUrl(permParam)
        return html`<span>Stop seeding <a @click=${viewArchive}>${permOpts.title}</a></span>`
      }

    case 'experimentalGlobalFetch':
      {
        let viewPage = openUrl(permParam)
        return html`<span>Fetch data from <a @click=${viewPage}>${permParam}</a></span>`
      }

    case 'experimentalCapturePage':
      {
        let viewPage = openUrl(permParam)
        return html`<span>Take a screenshot of <a @click=${viewPage}>${permParam}</a></span>`
      }
  }
}

exports.getPermId = function (permissionToken) {
  return permissionToken.split(':')[0]
}

exports.getPermParam = function (permissionToken) {
  return permissionToken.split(':').slice(1).join(':')
}

function shorten (str, n = 6) {
  if (str.length > (n + 3)) {
    return str.slice(0, n) + '...'
  }
  return str
}