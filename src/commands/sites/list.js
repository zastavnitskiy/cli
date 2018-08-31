const { flags } = require('@oclif/command')
const chalk = require('chalk')
const Command = require('../../base')
const renderShortDesc = require('../../utils/renderShortDescription')

class SitesListCommand extends Command {
  async run() {
    const { flags } = this.parse(SitesListCommand)
    await this.authenticate()

    const sites = await this.netlify.listSites()

    if (sites && sites.length) {
      const logSites = sites.map(site => {
        //console.log('site', site)
        return {
          id: site.id,
          name: site.name,
          ssl_url: site.ssl_url,
          repo_url: site.build_settings.repo_url,
        }
      })

      // Json response for piping commands
      if (flags.json) {
        const redactedSites = sites.map(site => {
          delete site.build_settings.env
          return site
        })
        console.log(JSON.stringify(redactedSites, null, 2))
        return false
      }

      console.log('Netlify Sites')
      console.log(`──────────────────────────────────────────`)

      logSites.forEach(s => {
        console.log(`${chalk.greenBright(s.name)} (id: ${s.id})`)
        console.log(`  ${chalk.whiteBright.bold('url:')}  ${chalk.yellowBright(s.ssl_url)}`)
        console.log(`  ${chalk.whiteBright.bold('repo:')} ${chalk.white(s.repo_url)}`)
        console.log(`──────────────────────────────────────────`)
      })
    }
  }
}

SitesListCommand.description = `${renderShortDesc('List all sites you have access too')}`

SitesListCommand.flags = {
  json: flags.boolean({
    description: 'Output site data as JSON'
  })
}

module.exports = SitesListCommand
