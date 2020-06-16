const fs = require('fs-extra');
const path = require('path');
const NodeJsNpmBuildFlow = require('@src/builtins/build-flows/nodejs-npm');
const JavaMvnBuildFlow = require('@src/builtins/build-flows/java-mvn');
const PythonPipBuildFlow = require('@src/builtins/build-flows/python-pip');
const ZipOnlyBuildFlow = require('@src/builtins/build-flows/zip-only');

const BUILD_FLOWS = [
    NodeJsNpmBuildFlow,
    JavaMvnBuildFlow,
    PythonPipBuildFlow
];

class CodeBuilder {
    /**
     * Constructor for CodeBuilder
     * @param {Object} config { src, build, doDebug }, where build = { folder, file }.
     */
    constructor(config) {
        const { src, build, doDebug } = config;
        this.src = src;
        this.build = build;
        this.doDebug = doDebug;
        this.BuildFlowClass = null;
        this.buildFlowName = null;
        this._selectBuildFlowClass();
    }

    /**
     * Executes build flow
     * @param {Function} callback (error)
     */
    execute(callback) {
        try {
            this._setUpBuildFolder();
        } catch (fsErr) {
            return process.nextTick(callback(fsErr));
        }
        const options = { cwd: this.build.folder, src: this.src, buildFile: this.build.file, doDebug: this.doDebug };
        const builder = new this.BuildFlowClass(options);
        builder.execute((error) => callback(error));
    }

    _setUpBuildFolder() {
        fs.ensureDirSync(this.build.folder);
        fs.emptyDirSync(this.build.folder);
        fs.copySync(path.resolve(this.src), this.build.folder, { filter: src => !src.includes(this.build.folder) });
    }

    _selectBuildFlowClass() {
        this.BuildFlowClass = ZipOnlyBuildFlow; // default
        if (fs.statSync(this.src).isDirectory()) {
            for (const buildFlow of BUILD_FLOWS) {
                const { manifest } = buildFlow;
                if (fs.existsSync(path.join(this.src, manifest))) {
                    this.BuildFlowClass = buildFlow;
                    break;
                }
            }
        }
        this.buildFlowName = this.BuildFlowClass.name;
    }
}

module.exports = CodeBuilder;
