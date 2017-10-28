'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _currentGitBranch = require('current-git-branch');

var _currentGitBranch2 = _interopRequireDefault(_currentGitBranch);

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _isGitRepository = require('is-git-repository');

var _isGitRepository2 = _interopRequireDefault(_isGitRepository);

var _os = require('os');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pathIsAbsolute = require('path-is-absolute');

var _pathIsAbsolute2 = _interopRequireDefault(_pathIsAbsolute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();

var gitNeedsPush = function gitNeedsPush() {
    var altPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : cwd;

    var thisPath = (0, _pathIsAbsolute2.default)(altPath) ? altPath : _path2.default.join(cwd, altPath);

    if (!(0, _isGitRepository2.default)(thisPath)) {
        return false;
    }

    try {
        var exec = void 0;
        var date = new Date();
        var command = ['(cd ' + thisPath + ';',
            'git add . ;',
            'git commit -m "' + date + '" ;',
            ' git push)'
            // ' git push  --dry-run --no-verify)'
        ].join(' ');

        if ((0, _os.platform)() === 'win32') {
            exec = _execa2.default.shellSync('pushd ' + thisPath + ' & git push --dry-run --no-verify');
        } else {
            exec = _execa2.default.shellSync(command);
            // exec = _execa2.default.shellSync('(cd ' + thisPath + ';' + 'git push --dry-run --no-verify)');
        }

        // check if the current branch will be in the git output
        if (exec.stderr.match('up-to-date')) {
            return false;
        }

        return true;
    } catch (e) {
        // check if the current branch will be in the git output
        if (e.message.match((0, _currentGitBranch2.default)(thisPath))) {
            return true;
        }

        return false;
    }
};



exports.default = gitNeedsPush;
module.exports = exports['default'];
