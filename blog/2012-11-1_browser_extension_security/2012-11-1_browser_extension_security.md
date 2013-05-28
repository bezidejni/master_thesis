# Introduction
Browser extensions have become an important part of a typical users workflow while interacting with the web. They allow us to enhance our browsing experience by providing new features. As useful as they might be, they could also be a potential threat to the user without him ever realizing it. This blog post provides a short overview of the state of browser extensions in two popular web browsers (Firefox and Chrome) and analyzes the potential damage those extensions can cause. 

# Extension design and vulnerabilities
## Chrome
Every Chrome extension contains a manifest file containing permissions that is needed for that extension to run. This ranges from accessing history on specific websites to accessing the whole browsing history, data from the clipboard and cookies. When installing the extension, the user is presented with a dialog containing a list of needed permissions which user then needs to grant or deny:

SLIKA DIJALOGA: http://developer.chrome.com/stable/static/images/perms-hw2.png

Most users don't bother reading this dialog and click 'Allow' by default, which is obviously very dangerous. A malicious attacker can persuade a user to install his extension and request all permissions which user naively grants him. At that moment, the attacker has the control of the browser. He can access the users cookies which often means that he has access to web sites that user is currently logged in. He can also download and inject malicious scripts in web pages. 

An example of this was an attack targeting Brazilian users of Chrome and Facebook. An attacker convinced users to download and install a malicious extension hosted on Chrome Web Store. After the installation, the extension downloaded a script file which gave the attacker access to the victims Facebook profile. They had the ability to send messages using that account to invite more potential victims to install the extension. Using those account, they were able to 'Like' any page on Facebook, which they managed to monetize by selling that service to companies wanting to get more publicity on Facebook. [1]

But the problem doesn't just lie with the malicious extensions. Researchers from the University of California, Berkeley have shown in their study[2] that vulnerabilities can be introduced by well-meaning extension developers that don't fully follow recommended security best practices. They analyzed 100 of Chrome extensions, including the 50 most popular and found that 40% have at least one vulnerability. The most common were man-in-the-middle attacks inserting malicious scripts by altering the HTTP traffic and XSS attacks from the websites trusted by an extension.

The positive side of the Crome security model is that each extension runs in a sandbox that restricts the attacker in accessing the OS and arbitrarily reading and writing data to the hard disk.

## Firefox
Add-ons on Mozilla website go under a review process before publishing on the web site. Reviewers analyze the code and run the extension in a sandboxed environment. While this is a welcome addition to the publishing process, this usually stops only the most outright malicious extensions. The malicious code can be obfuscated and non-malicious but vulnerable extension can slip through. But all that is circumvented if an attacker hosts the extension on his website and convinces the victim to install it.

It that regard, the situation is even worse than in Chrome. The only warning that is shown to the user before installing the extension looks like this:

SLIKA DIJALOGA: http://www.herdict.org/assets/ff_2_install.gif

No permissions exist, unlike Chrome, and once the extension is installed it has full permissions in the browser. For example, the attacker can then intercept usernames and password input in forms and send them to his server. Also, if the master password on password manager isn't set, the extension can read all passwords saved in the victims password manager.[3]

# Conclusion
As we saw, malicious browser extensions can cause a lot of problems for the unsuspecting user. The first and most important step for most users is not to install untrusted extensions from suspicious web sites. While downloading a popular extension from Chrome/Firefox store doesn't guarantee its security, the chance that it's malicious is much lower.
The introduction of the sandbox in Chrome is a welcome step forward, but the security model leaves much to be desired.


[1] Think twice before installing Chrome extensions, http://www.securelist.com/en/blog/208193414/Think_twice_before_installing_Chrome_extensions
[2] Nicholas Carlini, Adrienne Porter Felt, and David Wagner: An Evaluation of the Google Chrome Extension Security Architecture, http://www.eecs.berkeley.edu/~afelt/extensionvulnerabilities.pdf
[3] Julian Verdurmen: Firefox extension security, http://www.cs.ru.nl/bachelorscripties/2008/Julian_Verdurmen___0413380___Firefox_extension_security.pdf