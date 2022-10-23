import { debounce } from 'lodash'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import packageJSON from './package.json'
import electron from 'vite-electron-plugin'
import renderer from 'vite-plugin-electron-renderer'
import { customStart } from 'vite-electron-plugin/plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    electron(electronConfig()),

    // Use Node.js API in the Renderer-process
    renderer(rendererConfig()),
  ],

  server: serverConfig(),

  clearScreen: false,
})


/**
 * Get the server config options.
 * 
 * @returns object
 */
function serverConfig() {
  let config = {}

  if (process.env.VSCODE_DEBUG) {
    let URI = new URL(packageJSON.debug.env.VITE_DEV_SERVER_URL)
    Object.assign(config, { host: URI.host, port: +URI.port })
  }

  return config
}

/**
 * Get the renderer config.
 * 
 * @returns object
 */
function rendererConfig() {
  let config = {
    nodeIntegration: true
  }

  return config
}

/**
 * Get the electron config.
 * 
 * @returns object
 */
function electronConfig() {
  let config = {

    include: ['electron'],

    transformOptions: {
      sourcemap: !!process.env.VSCODE_DEBUG,
    },

    // Will start Electron via VSCode Debug
    plugins: electronPlugins()
  }

  return config
}

/**
 * Get the electron plugins.
 * 
 * @returns object
 */
function electronPlugins() {
  if (!process.env.VSCODE_DEBUG) return undefined

  return [
    customStart(debounce(() => {
      console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
    }))
  ]
}
