const AbstractBuildFlow = require('./abstract-build-flow');

class ZipOnlyBuildFlow extends AbstractBuildFlow {
    constructor({ cwd, src, buildFile, doDebug }) {
        super({ cwd, src, buildFile, doDebug });
    }

    execute(callback) {
        this.createZip(callback);
    }
}

module.exports = ZipOnlyBuildFlow;
