
/*
* @provider {Object} API 接口url
* @return {Function} get language package
* */
niceShare.Service.provider('GetLanguage', [
    'LANGUAGE_COUNTRY',
    function (LANGUAGE_COUNTRY) {
        return {
            /*
             * @param {String} nationality 语言所属代表国
             * @return {String} 获取国籍对应的语言包的key
             * */
            getLanguageKey : function (nationality) {
                var language = LANGUAGE_COUNTRY[nationality];
                if(language) {
                    return nationality;
                }

                for(var key in LANGUAGE_COUNTRY) {
                    for(var i = 0; i < LANGUAGE_COUNTRY[key].length; i++) {
                        if(nationality === LANGUAGE_COUNTRY[key][i]) {
                            return LANGUAGE_COUNTRY[key][i];
                        }
                    }
                }

                return nationality;
            },

            $get : [
                'LANGUAGE_PACKAGE',
                function (LANGUAGE_PACKAGE) {
                    var self = this;

                    /*
                     * 获取语言包，没有找到返回US语言包
                     * */
                    return function (nationality) {
                        if(!nationality) {
                            nationality = 'US';
                        }

                        var languageKey = self.getLanguageKey(nationality);
                        var langPack = LANGUAGE_PACKAGE[languageKey];
                        if(!langPack) {
                            langPack = LANGUAGE_PACKAGE['US'];
                        }

                        return langPack;
                    };
                }
            ]
        }
    }
]);
