const AbstractBuildFlow = require('./abstract-build-flow');

class PythonPipBuildFlow extends AbstractBuildFlow {
    static get manifest() { return 'requirements.txt'; }

    constructor({ cwd, src, buildFile, doDebug }) {
        super({ cwd, src, buildFile, doDebug });
    }

    execute(callback) {
        const pipCmdPrefix = this.isWindows ? 'venv/Scripts/pip3' : 'venv/bin/python -m pip';
        this.debug('Setting up virtual environment.');
        this.execCommand('python3 -m venv venv');
        this.debug(`Installing Python dependencies based on the ${PythonPipBuildFlow.manifest}.`);
        this.execCommand(`${pipCmdPrefix} --disable-pip-version-check install -r requirements.txt -t ./`);
        this.createZip((error) => callback(error));
    }
}

module.exports = PythonPipBuildFlow;
