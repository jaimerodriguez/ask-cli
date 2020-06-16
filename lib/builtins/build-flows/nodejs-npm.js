const AbstractBuildFlow = require('./abstract-build-flow');

class NodeJsNpmBuildFlow extends AbstractBuildFlow {
    static get manifest() { return 'package.json'; }

    constructor({ cwd, src, buildFile, doDebug }) {
        super({ cwd, src, buildFile, doDebug });
    }

    execute(callback) {
        const quiteFlag = this.doDebug ? '' : ' --quite';
        this.debug(`Installing NodeJS dependencies based on the ${NodeJsNpmBuildFlow.manifest}.`);
        this.execCommand(`npm install --production${quiteFlag}`);
        this.createZip((error) => callback(error));
    }
}

module.exports = NodeJsNpmBuildFlow;
