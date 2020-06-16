const { expect } = require('chai');
const sinon = require('sinon');

const AbstractBuildFlow = require('@src/builtins/build-flows/abstract-build-flow');
const PythonPipBuildFlow = require('@src/builtins/build-flows/python-pip');

describe('PythonPipBuildFlow test', () => {
    let config;
    let execStub;
    let debugStub;
    let createZipStub;
    let platformStub;
    beforeEach(() => {
        config = {
            cwd: 'cwd',
            src: 'src',
            buildFile: 'buildFile',
            doDebug: false
        };
        execStub = sinon.stub(AbstractBuildFlow.prototype, 'execCommand');
        debugStub = sinon.stub(AbstractBuildFlow.prototype, 'debug');
        createZipStub = sinon.stub(AbstractBuildFlow.prototype, 'createZip').yields();
        platformStub = sinon.stub(process, 'platform').value('darwin');
    });
    describe('# inspect correctness of execute', () => {
        it('| should execute commands', (done) => {
            const buildFlow = new PythonPipBuildFlow(config);

            buildFlow.execute((err, res) => {
                expect(err).eql(undefined);
                expect(res).eql(undefined);
                expect(execStub.args[0][0]).eql('python3 -m venv venv');
                expect(execStub.args[1][0]).eql('venv/bin/python -m pip --disable-pip-version-check install -r requirements.txt -t ./');
                expect(createZipStub.callCount).eql(1);
                done();
            });
        });

        it('| should execute commands for windows', (done) => {
            platformStub.value('win32');
            const buildFlow = new PythonPipBuildFlow(config);

            buildFlow.execute((err, res) => {
                expect(err).eql(undefined);
                expect(res).eql(undefined);
                expect(execStub.args[0][0]).eql('python3 -m venv venv');
                expect(execStub.args[1][0]).eql('venv/Scripts/pip3 --disable-pip-version-check install -r requirements.txt -t ./');
                expect(createZipStub.callCount).eql(1);
                done();
            });
        });

        it('| should execute commands with debug flag', (done) => {
            config.doDebug = true;
            const buildFlow = new PythonPipBuildFlow(config);

            buildFlow.execute((err, res) => {
                expect(err).eql(undefined);
                expect(res).eql(undefined);
                expect(execStub.args[0][0]).eql('python3 -m venv venv');
                expect(execStub.args[1][0]).eql('venv/bin/python -m pip --disable-pip-version-check install -r requirements.txt -t ./');
                expect(debugStub.args[0][0]).eql('Setting up virtual environment.');
                expect(debugStub.args[1][0]).eql('Installing Python dependencies based on the requirements.txt.');
                done();
            });
        });
    });

    afterEach(() => {
        sinon.restore();
    });
});
