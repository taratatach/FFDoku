if (!navigator.mozApps)
{
    navigator.mozApps =
    {
    }
}
if (!navigator.mozApps.install || navigator.mozApps.html5Implementation)
{
    navigator.mozApps = (function ()
    {
        var t = (function ()
        {
            var H = Math.floor(Math.random() * 1000001);
            var M =
            {
            };

            function K(O, Q, P)
            {
                var R = false;
                if (O === "*")
                {
                    for (var N in M)
                    {
                        if (!M.hasOwnProperty(N))
                        {
                            continue
                        }
                        if (N === "*")
                        {
                            continue
                        }
                        if (typeof M[N][Q] === "object")
                        {
                            R = true
                        }
                    }
                }
                else
                {
                    if ((M["*"] && M["*"][Q]) || (M[O] && M[O][Q]))
                    {
                        R = true
                    }
                }
                if (R)
                {
                    throw "A channel already exists which overlaps with origin '" + O + "' and has scope '" + Q + "'"
                }
                if (typeof M[O] != "object")
                {
                    M[O] =
                    {
                    }
                }
                M[O][Q] = P
            }
            function I(N, O)
            {
                delete M[N][O]
            }
            function L(N)
            {
                if (Array.isArray)
                {
                    return Array.isArray(N)
                }
                else
                {
                    return (N.constructor.toString().indexOf("Array") != -1)
                }
            }
            var G =
            {
            };
            var J = function (S)
            {
                var N = JSON.parse(S.data);
                if (typeof N !== "object")
                {
                    return
                }
                var T = S.origin;
                var R = null;
                var Q = null;
                var O = null;
                if (typeof N.method === "string")
                {
                    var P = N.method.split("::");
                    if (P.length == 2)
                    {
                        R = P[0];
                        O = P[1]
                    }
                    else
                    {
                        O = N.method
                    }
                }
                if (typeof N.id !== "undefined")
                {
                    Q = N.id
                }
                if (typeof O === "string")
                {
                    if (M[T] && M[T][R])
                    {
                        M[T][R](T, O, N)
                    }
                    else
                    {
                        if (M["*"] && M["*"][R])
                        {
                            M["*"][R](T, O, N)
                        }
                    }
                }
                else
                {
                    if (typeof Q != "undefined")
                    {
                        if (G[Q])
                        {
                            G[Q](T, O, N)
                        }
                    }
                }
            };
            if (window.addEventListener)
            {
                window.addEventListener("message", J, false)
            }
            else
            {
                if (window.attachEvent)
                {
                    window.attachEvent("onmessage", J)
                }
            }
            return {
                build: function (W)
                {
                    var O = function (ad)
                    {
                        if (W.debugOutput && window.console && window.console.log)
                        {
                            try
                            {
                                if (typeof ad !== "string")
                                {
                                    ad = JSON.stringify(ad)
                                }
                            }
                            catch (ae)
                            {
                            }
                            console.log("[" + Q + "] " + ad)
                        }
                    };
                    if (!window.postMessage)
                    {
                        throw ("jschannel cannot run this browser, no postMessage")
                    }
                    if (!window.JSON || !window.JSON.stringify || !window.JSON.parse)
                    {
                        throw ("jschannel cannot run this browser, no JSON parsing/serialization")
                    }
                    if (typeof W != "object")
                    {
                        throw ("Channel build invoked without a proper object argument")
                    }
                    if (!W.window || !W.window.postMessage)
                    {
                        throw ("Channel.build() called without a valid window argument")
                    }
                    if (window === W.window)
                    {
                        throw ("target window is same as present window -- not allowed")
                    }
                    var P = false;
                    if (typeof W.origin === "string")
                    {
                        var R;
                        if (W.origin === "*")
                        {
                            P = true
                        }
                        else
                        {
                            if (null !== (R = W.origin.match(/^https?:\/\/(?:[-a-zA-Z0-9\.])+(?::\d+)?/)))
                            {
                                W.origin = R[0];
                                P = true
                            }
                        }
                    }
                    if (!P)
                    {
                        throw ("Channel.build() called with an invalid origin")
                    }
                    if (typeof W.scope !== "undefined")
                    {
                        if (typeof W.scope !== "string")
                        {
                            throw "scope, when specified, must be a string"
                        }
                        if (W.scope.split("::").length > 1)
                        {
                            throw "scope may not contain double colons: '::'"
                        }
                    }
                    var Q = (function ()
                    {
                        var af = "";
                        var ae = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        for (var ad = 0; ad < 5; ad++)
                        {
                            af += ae.charAt(Math.floor(Math.random() * ae.length))
                        }
                        return af
                    })();
                    var aa =
                    {
                    };
                    var N =
                    {
                    };
                    var X =
                    {
                    };
                    var Z = false;
                    var ac = [];
                    var T = function (ah, ad, ag)
                    {
                        var af = false;
                        var ae = false;
                        return {
                            origin: ad,
                            invoke: function (al, ai)
                            {
                                if (!X[ah])
                                {
                                    throw "attempting to invoke a callback of a non-existant transaction: " + ah
                                }
                                var ak = false;
                                for (var aj = 0; aj < ag.length; aj++)
                                {
                                    if (al === ag[aj])
                                    {
                                        ak = true;
                                        break
                                    }
                                }
                                if (!ak)
                                {
                                    throw "request supports no such callback '" + al + "'"
                                }
                                Y(
                                {
                                    id: ah,
                                    callback: al,
                                    params: ai
                                })
                            },
                            error: function (ai, aj)
                            {
                                ae = true;
                                if (!X[ah])
                                {
                                    throw "error called for non-existant message: " + ah
                                }
                                delete X[ah];
                                Y(
                                {
                                    id: ah,
                                    error: ai,
                                    message: aj
                                })
                            },
                            complete: function (ai)
                            {
                                ae = true;
                                if (!X[ah])
                                {
                                    throw "complete called for non-existant message: " + ah
                                }
                                delete X[ah];
                                Y(
                                {
                                    id: ah,
                                    result: ai
                                })
                            },
                            delayReturn: function (ai)
                            {
                                if (typeof ai === "boolean")
                                {
                                    af = (ai === true)
                                }
                                return af
                            },
                            completed: function ()
                            {
                                return ae
                            }
                        }
                    };
                    var ab = function (ao, ad, af)
                    {
                        if (typeof W.gotMessageObserver === "function")
                        {
                            try
                            {
                                W.gotMessageObserver(ao, af)
                            }
                            catch (ak)
                            {
                                O("gotMessageObserver() raised an exception: " + ak.toString())
                            }
                        }
                        if (af.id && ad)
                        {
                            if (aa[ad])
                            {
                                var ar = T(af.id, ao, af.callbacks ? af.callbacks : []);
                                X[af.id] =
                                {
                                };
                                try
                                {
                                    if (af.callbacks && L(af.callbacks) && af.callbacks.length > 0)
                                    {
                                        for (var aj = 0; aj < af.callbacks.length; aj++)
                                        {
                                            var aq = af.callbacks[aj];
                                            var ai = af.params;
                                            var ae = aq.split("/");
                                            for (var ah = 0; ah < ae.length - 1; ah++)
                                            {
                                                var an = ae[ah];
                                                if (typeof ai[an] !== "object")
                                                {
                                                    ai[an] =
                                                    {
                                                    }
                                                }
                                                ai = ai[an]
                                            }
                                            ai[ae[ae.length - 1]] = (function ()
                                            {
                                                var at = aq;
                                                return function (au)
                                                {
                                                    return ar.invoke(at, au)
                                                }
                                            })()
                                        }
                                    }
                                    var ag = aa[ad](ar, af.params);
                                    if (!ar.delayReturn() && !ar.completed())
                                    {
                                        ar.complete(ag)
                                    }
                                }
                                catch (ak)
                                {
                                    var am = "runtime_error";
                                    var ap = null;
                                    if (typeof ak === "string")
                                    {
                                        ap = ak
                                    }
                                    else
                                    {
                                        if (typeof ak === "object")
                                        {
                                            if (ak && L(ak) && ak.length == 2)
                                            {
                                                am = ak[0];
                                                ap = ak[1]
                                            }
                                            else
                                            {
                                                if (typeof ak.error === "string")
                                                {
                                                    am = ak.error;
                                                    if (!ak.message)
                                                    {
                                                        ap = ""
                                                    }
                                                    else
                                                    {
                                                        if (typeof ak.message === "string")
                                                        {
                                                            ap = ak.message
                                                        }
                                                        else
                                                        {
                                                            ak = ak.message
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (ap === null)
                                    {
                                        try
                                        {
                                            ap = JSON.stringify(ak)
                                        }
                                        catch (al)
                                        {
                                            ap = ak.toString()
                                        }
                                    }
                                    ar.error(am, ap)
                                }
                            }
                        }
                        else
                        {
                            if (af.id && af.callback)
                            {
                                if (!N[af.id] || !N[af.id].callbacks || !N[af.id].callbacks[af.callback])
                                {
                                    O("ignoring invalid callback, id:" + af.id + " (" + af.callback + ")")
                                }
                                else
                                {
                                    N[af.id].callbacks[af.callback](af.params)
                                }
                            }
                            else
                            {
                                if (af.id)
                                {
                                    if (!N[af.id])
                                    {
                                        O("ignoring invalid response: " + af.id)
                                    }
                                    else
                                    {
                                        if (af.error)
                                        {
                                            (1, N[af.id].error)(af.error, af.message)
                                        }
                                        else
                                        {
                                            if (af.result !== undefined)
                                            {
                                                (1, N[af.id].success)(af.result)
                                            }
                                            else
                                            {
                                                (1, N[af.id].success)()
                                            }
                                        }
                                        delete N[af.id];
                                        delete G[af.id]
                                    }
                                }
                                else
                                {
                                    if (ad)
                                    {
                                        if (aa[ad])
                                        {
                                            aa[ad](null, af.params)
                                        }
                                    }
                                }
                            }
                        }
                    };
                    K(W.origin, ((typeof W.scope === "string") ? W.scope : ""), ab);
                    var S = function (ad)
                    {
                        if (typeof W.scope === "string" && W.scope.length)
                        {
                            ad = [W.scope, ad].join("::")
                        }
                        return ad
                    };
                    var Y = function (ag, ad)
                    {
                        if (!ag)
                        {
                            throw "postMessage called with null message"
                        }
                        var af = (Z ? "post  " : "queue ");
                        O(af + " message: " + JSON.stringify(ag));
                        if (!ad && !Z)
                        {
                            ac.push(ag)
                        }
                        else
                        {
                            if (typeof W.postMessageObserver === "function")
                            {
                                try
                                {
                                    W.postMessageObserver(W.origin, ag)
                                }
                                catch (ae)
                                {
                                    O("postMessageObserver() raised an exception: " + ae.toString())
                                }
                            }
                            W.window.postMessage(JSON.stringify(ag), W.origin)
                        }
                    };
                    var V = function (ad, ae)
                    {
                        O("ready msg received");
                        if (Z)
                        {
                            throw "received ready message while in ready state.  help!"
                        }
                        if (ae === "ping")
                        {
                            Q += "-R"
                        }
                        else
                        {
                            Q += "-L"
                        }
                        U.unbind("__ready");
                        Z = true;
                        O("ready msg accepted.");
                        if (ae === "ping")
                        {
                            U.notify(
                            {
                                method: "__ready",
                                params: "pong"
                            })
                        }
                        while (ac.length)
                        {
                            Y(ac.pop())
                        }
                        if (typeof W.onReady === "function")
                        {
                            W.onReady(U)
                        }
                    };
                    var U =
                    {
                        unbind: function (ad)
                        {
                            if (aa[ad])
                            {
                                if (!(delete aa[ad]))
                                {
                                    throw ("can't delete method: " + ad)
                                }
                                return true
                            }
                            return false
                        },
                        bind: function (ae, ad)
                        {
                            if (!ae || typeof ae !== "string")
                            {
                                throw "'method' argument to bind must be string"
                            }
                            if (!ad || typeof ad !== "function")
                            {
                                throw "callback missing from bind params"
                            }
                            if (aa[ae])
                            {
                                throw "method '" + ae + "' is already bound!"
                            }
                            aa[ae] = ad
                        },
                        call: function (ad)
                        {
                            if (!ad)
                            {
                                throw "missing arguments to call function"
                            }
                            if (!ad.method || typeof ad.method !== "string")
                            {
                                throw "'method' argument to call must be string"
                            }
                            if (!ad.success || typeof ad.success !== "function")
                            {
                                throw "'success' callback missing from call"
                            }
                            var ag =
                            {
                            };
                            var af = [];
                            var ae = function (al, ak)
                            {
                                if (typeof ak === "object")
                                {
                                    for (var ai in ak)
                                    {
                                        if (!ak.hasOwnProperty(ai))
                                        {
                                            continue
                                        }
                                        var aj = al + (al.length ? "/" : "") + ai;
                                        if (typeof ak[ai] === "function")
                                        {
                                            ag[aj] = ak[ai];
                                            af.push(aj);
                                            delete ak[ai]
                                        }
                                        else
                                        {
                                            if (typeof ak[ai] === "object")
                                            {
                                                ae(aj, ak[ai])
                                            }
                                        }
                                    }
                                }
                            };
                            ae("", ad.params);
                            var ah =
                            {
                                id: H,
                                method: S(ad.method),
                                params: ad.params
                            };
                            if (af.length)
                            {
                                ah.callbacks = af
                            }
                            N[H] =
                            {
                                callbacks: ag,
                                error: ad.error,
                                success: ad.success
                            };
                            G[H] = ab;
                            H++;
                            Y(ah)
                        },
                        notify: function (ad)
                        {
                            if (!ad)
                            {
                                throw "missing arguments to notify function"
                            }
                            if (!ad.method || typeof ad.method !== "string")
                            {
                                throw "'method' argument to notify must be string"
                            }
                            Y(
                            {
                                method: S(ad.method),
                                params: ad.params
                            })
                        },
                        destroy: function ()
                        {
                            I(W.origin, ((typeof W.scope === "string") ? W.scope : ""));
                            if (window.removeEventListener)
                            {
                                window.removeEventListener("message", ab, false)
                            }
                            else
                            {
                                if (window.detachEvent)
                                {
                                    window.detachEvent("onmessage", ab)
                                }
                            }
                            Z = false;
                            aa =
                            {
                            };
                            X =
                            {
                            };
                            N =
                            {
                            };
                            W.origin = null;
                            ac = [];
                            O("channel destroyed");
                            Q = ""
                        }
                    };
                    U.bind("__ready", V);
                    setTimeout(function ()
                    {
                        Y(
                        {
                            method: S("__ready"),
                            params: "ping"
                        }, true)
                    }, 0);
                    return U
                }
            }
        })();
        var p = false;
        var h = window;
        var k = "https://apps.persona.org";
        var d = "/include.html";
        var o = null;
        var E = null;
        var a = "myappsOrgInstallOverlay";
        var B = "myappsTrustedIFrame";

        function D()
        {
            return location.protocol + "//" + location.host == k
        }
        function z()
        {
            this.result = null;
            this.error = null;
            this.onerror = null;
            this.onsuccess = null
        }
        function w(H, G)
        {
            H.error = G;
            if (H.onerror)
            {
                H.onerror()
            }
        }
        function r(H, G)
        {
            if (G !== undefined)
            {
                H.result = G
            }
            if (H.onsuccess)
            {
                H.onsuccess()
            }
        }
        function F(G)
        {
            this.manifest = G.manifest;
            this.manifestURL = G.manifestURL;
            if (G.installData)
            {
                this.receipts = G.installData.receipts;
                if ((!this.receipts) && G.installData.receipt)
                {
                    this.receipts = [G.installData.receipt]
                }
            }
            else
            {
                this.receipts = null
            }
            this.origin = G.origin;
            this.installOrigin = G.installOrigin;
            this.installTime = G.installTime
        }
        F.fromArray = function (I)
        {
            var G = [];
            for (var H = 0; H < I.length; H++)
            {
                G.push(new F(I[H]))
            }
            return G
        };
        F.prototype.launch = function ()
        {
            if (!D())
            {
                throw "PERMISSION_DENIED"
            }
            var H = this.origin;
            if (this.manifest.launch_path)
            {
                H += this.manifest.launch_path
            }
            var G = ("openwebapp_" + H).replace(/[.:]/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
            window.open(H, G)
        };
        F.prototype.uninstall = function ()
        {
            v();
            var G = new z();
            E.call(
            {
                method: "uninstall",
                params: this.origin,
                error: function (H)
                {
                    w(G, H)
                },
                success: function ()
                {
                    r(G)
                }
            });
            return G
        };

        function e()
        {
            try
            {
                C()
            }
            catch (H)
            {
            }
            var G = document.createElement("div");
            G.id = a;
            G.style.background = "#000";
            G.style.opacity = ".66";
            G.style.filter = "alpha(opacity=66)";
            G.style.position = "fixed";
            G.style.top = "0";
            G.style.left = "0";
            G.style.height = "100%";
            G.style.width = "100%";
            G.style.zIndex = "998";
            document.body.appendChild(G);
            document.getElementById(B).style.display = "inline"
        }
        function C()
        {
            document.getElementById(B).style.display = "none";
            document.body.removeChild(document.getElementById(a))
        }
        function u()
        {
            var G = navigator.userAgent;
            if (G.search(/AppleWebKit/) == -1)
            {
                return false
            }
            return G.search(/iPhone|iPod|Android/) != -1
        }
        function v()
        {
            if (o)
            {
                return
            }
            var G = h.document;
            o = document.createElement("iframe");
            o.id = B;
            if (u())
            {
                o.style.position = "absolute"
            }
            else
            {
                o.style.position = "fixed"
            }
            o.style.left = "50%";
            if (u())
            {
                o.style.top = (window.pageYOffset + 166) + "px"
            }
            else
            {
                o.style.top = "40%"
            }
            o.style.width = "410px";
            o.style.marginLeft = "-205px";
            o.style.height = "332px";
            o.style.marginTop = "-166px";
            o.style.zIndex = "999";
            o.style.opacity = "1";
            o.style.border = "2px solid #aaaaaa";
            o.style.MozBorderRadius = "8px";
            o.style.WebkitBorderRadius = "8px";
            o.style.borderRadius = "8px 8px 8px 8px";
            o.style.display = "none";
            G.body.appendChild(o);
            o.src = k + d;
            E = t.build(
            {
                window: o.contentWindow,
                origin: "*",
                scope: "openwebapps"
            });
            E.bind("showme", function (I, H)
            {
                e()
            });
            E.bind("hideme", function (I, H)
            {
                C()
            })
        }
        function y(J, I, G)
        {
            var H =
            {
                code: J,
                message: I
            };
            if (typeof G === "function")
            {
                G.call(undefined, H)
            }
            else
            {
                throw H
            }
        }
        function A(H, G)
        {
            if (H === undefined)
            {
                throw "install missing required url argument"
            }
            if (typeof H !== "string")
            {
                throw "first (url) parameter to install() must be a string"
            }
            v();
            if (G === undefined)
            {
                G = null
            }
            var I = new z();
            E.call(
            {
                method: "install",
                params: {
                    url: H,
                    installData: G
                },
                error: function (J)
                {
                    w(I, J)
                },
                success: function (J)
                {
                    r(I, new F(J))
                }
            });
            return I
        }
        function m(J, I, H, G)
        {
            v();
            if (!I)
            {
                I =
                {
                }
            }
            else
            {
                if (typeof(I) !== "object")
                {
                    throw "parameter to invokeService() must be an object"
                }
            }
            if (typeof(J) !== "string" || J.length === 0)
            {
                throw "invokeService missing required name argument"
            }
            E.call(
            {
                method: "invokeService",
                params: {
                    name: J,
                    args: I
                },
                error: function (K, L)
                {
                    y(K, L, G)
                },
                success: function (K)
                {
                    if (H)
                    {
                        H(K)
                    }
                }
            })
        }
        function l()
        {
            v();
            var G = new z();
            E.call(
            {
                method: "getSelf",
                error: function (H)
                {
                    w(G, H)
                },
                success: function (H)
                {
                    if (H !== null)
                    {
                        H = new F(H)
                    }
                    r(G, H)
                }
            });
            return G
        }
        function n()
        {
            v();
            var G = new z();
            E.call(
            {
                method: "getInstalled",
                error: function (H)
                {
                    w(G, H)
                },
                success: function (H)
                {
                    r(G, F.fromArray(H))
                }
            });
            return G
        }
        var b = [];

        function x()
        {
            v();
            var G = new z();
            E.call(
            {
                method: "getAll",
                error: function (H)
                {
                    w(G, H)
                },
                success: function (H)
                {
                    r(G, F.fromArray(H))
                }
            });
            return G
        }
        function c(G)
        {
        }
        var g = false;
        var i =
        {
        };

        function q(G, H)
        {
            if (!i[G])
            {
                i[G] = []
            }
            i[G].push(H)
        }
        function f(G, J)
        {
            if (!i[G])
            {
                return
            }
            for (var H = 0; H < i[G].length; H++)
            {
                var I = i[G][H];
                if (I == J)
                {
                    i[G].splice(H, 1);
                    break
                }
            }
        }
        if (D())
        {
            window.addEventListener("load", function ()
            {
                v();
                E.call(
                {
                    method: "trackChanges",
                    params: {
                    },
                    success: function ()
                    {
                    }
                });
                E.bind("change", function (O, G)
                {
                    O.complete(true);
                    if (G.type == "add")
                    {
                        var M = "install"
                    }
                    else
                    {
                        if (G.type == "remove")
                        {
                            var M = "uninstall"
                        }
                    }
                    var L = i[M];
                    var K = s.mgmt ? s.mgmt["on" + M] : null;
                    if (L || K)
                    {
                        for (var J = 0; J < G.objects.length; J++)
                        {
                            var H = new F(G.objects[J]);
                            if (L)
                            {
                                for (var I = 0; I < L.length; I++)
                                {
                                    var N = L[I];
                                    N(
                                    {
                                        application: H
                                    })
                                }
                            }
                            if (K)
                            {
                                K(
                                {
                                    application: H
                                })
                            }
                        }
                    }
                })
            })
        }
        function j(I, H, G)
        {
        }
        var s =
        {
            install: A,
            invokeService: m,
            getSelf: l,
            getInstalled: n,
            services: {
                ready: c,
                registerHandler: j
            },
            html5Implementation: true
        };
        if (D())
        {
            s.mgmt =
            {
                getAll: x,
                addEventListener: q,
                removeEventListener: f,
                oninstall: null,
                onuninstall: null
            }
        }
        if (p)
        {
            s.setRepoOrigin = function (G)
            {
                k = G
            };
            s.setMockResponse = function (I, H, G)
            {
                v();
                E.call(
                {
                    method: "setMockResponse",
                    params: I,
                    error: function (J, K)
                    {
                        y(J, K, G)
                    },
                    success: function ()
                    {
                        if (H)
                        {
                            H()
                        }
                    }
                })
            };
            s.setApplicationChooser = function (I, H, G)
            {
                v();
                E.call(
                {
                    method: "setApplicationChooser",
                    params: I,
                    error: function (J, K)
                    {
                        y(J, K, G)
                    },
                    success: function ()
                    {
                        if (H)
                        {
                            H()
                        }
                    }
                })
            }
        }
        return s
    })()
};