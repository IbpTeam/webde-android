Frequently Used Command:
cordova create HybridApp dev.hybridapp
cd HybridApp
cordova platform add android
cordova plugin add org.apache.cordova.device
git subtree pull --prefix=HybridApp HybridApp master
git subtree push --prefix=HybridApp HybridApp master

ibp.plugin.watch依赖google-play-services_lib
