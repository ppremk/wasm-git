const lgPromise = require('./common.js').lgPromise;
const assert = require('assert');


describe('git checkout', () => {
    it('should discard changes to a path', async () => {
        const lg = await lgPromise;
        const FS = lg.FS;
        FS.writeFile('/home/web_user/.gitconfig', '[user]\n' +
                    'name = Test User\n' +
                    'email = test@example.com');
                
        FS.mkdir('test');
        FS.chdir('test');
        lg.callMain(['init', '.']);

        FS.writeFile('test.txt', 'abcdef');
        lg.callMain(['add', 'test.txt']);
        lg.callMain(['commit', '-m', 'test commit']);
        assert.equal(FS.readFile('test.txt', {encoding: 'utf8'}), 'abcdef');
        FS.writeFile('test.txt', 'abcdefg');
        lg.callMain(['checkout', '--', 'test.txt']);
        lg.callMain(['status']);
        assert.equal(FS.readFile('test.txt', {encoding: 'utf8'}), 'abcdef',
                'expecting file content to be reverted');
    });
});
