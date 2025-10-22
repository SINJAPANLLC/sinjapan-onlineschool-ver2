import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-40 shadow-lg">
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                            data-testid="button-back"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Shield className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">プライバシーポリシー</h1>
                                <p className="text-sm text-blue-100">Privacy Policy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 max-w-4xl mx-auto pb-8"
            >
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
                    <h1 className="text-3xl font-bold text-blue-600 mb-6">
                        プライバシーポリシー
                    </h1>

                    <h2 className="text-2xl font-bold text-blue-600 mb-4">第1条（総則）</h2>

                    <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-8">
                        <li>
                            オンライン学習プラットフォーム「SIN JAPAN ONLINE SCHOOL」（以下「本サービス」といいます。）を運営する合同会社SIN JAPAN KANAGAWA（以下「当社」といいます。）は、本サービスの利用者（以下「利用者」という）のプライバシーを尊重し、利用者の個人情報およびその他の利用者のプライバシーに係る情報（以下「プライバシー情報」といいます。）の管理に細心の注意を払います。
                        </li>
                        <li>
                            当社は、個人情報保護法をはじめとする各法令およびその他の規範を遵守して利用者から収集した個人情報を適切に取り扱います。また、当社は、個人情報を取り扱う体制の強化、SSL技術の導入等、利用者の個人情報の取り扱いについて、継続的な改善を図っています。
                        </li>
                    </ol>

                    <h2 className="text-2xl font-bold text-blue-600 mb-4">第2条（本ポリシーへの同意）</h2>

                    <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-8">
                        <li>
                            利用者は、アカウント登録を通じて当社に自身のプライバシー情報を提供する場合、本ポリシーを熟読し、その内容に同意するものとします。
                        </li>
                        <li>
                            利用者は、当社によるプライバシー情報の使用等について同意を撤回することができます。この場合、本サービスを継続利用することはできません。
                        </li>
                        <li>
                            当社は、クッキー、IPアドレス、アクセスログ等のWEBトラッキング技術を活用して利用者の行動や嗜好に関する情報を収集します。当社は、利用者が本サービスを利用した場合、当該利用者が当社によるこれらの技術を利用したプライバシー情報の収集について同意したものとみなします。
                        </li>
                    </ol>

                    <h2 className="text-2xl font-bold text-blue-600 mb-4">第3条（収集するプライバシー情報）</h2>

                    <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-8">
                        <li>
                            当社は、本サービスの提供に際して、利用者から以下の情報を収集または取得します。
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>氏名</li>
                                <li>メールアドレス</li>
                                <li>電話番号</li>
                                <li>生年月日</li>
                                <li>プロフィール情報（写真、専門分野、経歴等）</li>
                                <li>学習履歴、受講履歴</li>
                                <li>支払い情報</li>
                                <li>本サービス利用時のアクセスログ、閲覧履歴</li>
                            </ul>
                        </li>
                    </ol>

                    <h2 className="text-2xl font-bold text-blue-600 mb-4">第4条（利用目的）</h2>

                    <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-8">
                        <li>
                            当社は、収集した個人情報を以下の目的で利用します。
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>本サービスの提供・運営のため</li>
                                <li>利用者からのお問い合わせに対応するため</li>
                                <li>利用者に対する重要なお知らせの連絡のため</li>
                                <li>メンテナンス、重要なお知らせなど必要に応じた連絡のため</li>
                                <li>利用規約に違反した利用者の特定と対応のため</li>
                                <li>サービス改善のための統計データの分析のため</li>
                                <li>新サービス、新機能の案内のため</li>
                            </ul>
                        </li>
                    </ol>

                    <h2 className="text-2xl font-bold text-blue-600 mb-4">第5条（個人情報の第三者提供）</h2>

                    <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-8">
                        <li>
                            当社は、以下の場合を除き、あらかじめ利用者の同意を得ることなく、第三者に個人情報を提供することはありません。
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>法令に基づく場合</li>
                                <li>人の生命、身体または財産の保護のために必要がある場合</li>
                                <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
                                <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
                            </ul>
                        </li>
                    </ol>

                    <h2 className="text-2xl font-bold text-blue-600 mb-4">第6条（個人情報の開示・訂正・削除）</h2>

                    <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-8">
                        <li>
                            利用者は、当社に対し、自己の個人情報の開示を請求することができます。
                        </li>
                        <li>
                            利用者は、当社が保有する個人情報が誤っている場合には、訂正または削除を請求することができます。
                        </li>
                        <li>
                            当社は、前各項の請求を受けた場合には、速やかに必要な対応を行います。
                        </li>
                    </ol>

                    <h2 className="text-2xl font-bold text-blue-600 mb-4">第7条（セキュリティ）</h2>

                    <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-8">
                        <li>
                            当社は、個人情報の紛失、破壊、改ざん、漏洩等のリスクに対し、適切な安全対策を講じます。
                        </li>
                        <li>
                            当社は、SSL/TLS暗号化通信を使用し、個人情報の送受信を保護します。
                        </li>
                    </ol>

                    <h2 className="text-2xl font-bold text-blue-600 mb-4">第8条（プライバシーポリシーの変更）</h2>

                    <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-8">
                        <li>
                            当社は、必要に応じて本ポリシーを変更することがあります。
                        </li>
                        <li>
                            変更後のプライバシーポリシーは、本サービス上に掲載した時点から効力を生じるものとします。
                        </li>
                    </ol>

                    <h2 className="text-2xl font-bold text-blue-600 mb-4">第9条（お問い合わせ窓口）</h2>

                    <p className="text-gray-700 mb-8">
                        本ポリシーに関するお問い合わせは、本サービス内のお問い合わせフォームよりご連絡ください。
                    </p>

                    <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                        <p className="text-gray-600 font-medium">
                            2025年1月1日 制定
                        </p>
                        <p className="text-gray-600 mt-2">
                            合同会社SIN JAPAN KANAGAWA
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PrivacyPolicy;
